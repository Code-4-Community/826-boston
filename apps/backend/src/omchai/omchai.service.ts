import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Omchai, OmchaiRole } from './omchai.entity';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { Story } from '../story/story.entity';
import { Anthology } from '../anthology/anthology.entity';
import { Role } from '../users/types';
import { OmchaiAction, roleCan } from '../auth/omchai-permissions';

/** The parts of request.user that permission checks need. */
export type OmchaiActor = { id?: number; role?: string } | undefined;

const ROLE_LABELS: Record<OmchaiRole, string> = {
  [OmchaiRole.OWNER]: 'Owner',
  [OmchaiRole.MANAGER]: 'Manager',
  [OmchaiRole.CONSULTED]: 'Consulted',
  [OmchaiRole.HELPER]: 'Helper',
  [OmchaiRole.APPROVER]: 'Approver',
  [OmchaiRole.INFORMED]: 'Informed',
};

const LEAD_ROLES = [OmchaiRole.OWNER, OmchaiRole.MANAGER];

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class OmchaiService {
  constructor(
    @InjectRepository(Omchai) private repo: Repository<Omchai>,
    @InjectRepository(Story) private storyRepo: Repository<Story>,
    @InjectRepository(Anthology) private anthologyRepo: Repository<Anthology>,
  ) {}

  /**
   * Throws ForbiddenException unless the user is an admin or their OMCHAI
   * role on the anthology allows every given action. With no actions, any
   * role on the anthology is enough.
   *
   * Reads the assignment from the database rather than request.user, because
   * CurrentUserInterceptor replaces request.user with a user loaded without
   * its omchaiAssignments.
   */
  async assertCan(
    user: OmchaiActor,
    anthologyId: number,
    actions: OmchaiAction[],
  ): Promise<void> {
    if (user?.role === Role.ADMIN) return;
    if (!user?.id) {
      throw new ForbiddenException('No role on this publication');
    }

    const assignment = await this.repo.findOne({
      where: { user: { id: user.id }, anthology: { id: anthologyId } },
    });
    if (!assignment) {
      throw new ForbiddenException('No role on this publication');
    }

    const required = actions.length > 0 ? actions : [OmchaiAction.VIEW];
    if (!required.every((action) => roleCan(assignment.role, action))) {
      throw new ForbiddenException(
        `Role ${assignment.role} cannot do this on this publication`,
      );
    }
  }

  async anthologyIdForStory(storyId: number): Promise<number> {
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
      relations: ['anthology'],
    });
    if (!story?.anthology) {
      throw new NotFoundException(`Story with ID ${storyId} not found`);
    }
    return story.anthology.id;
  }

  /** Story owns the FK to its draft, so look the story up by its draft. */
  async anthologyIdForStoryDraft(storyDraftId: number): Promise<number> {
    const story = await this.storyRepo.findOne({
      where: { storyDraft: { id: storyDraftId } },
      relations: ['anthology'],
    });
    if (!story?.anthology) {
      throw new NotFoundException(
        `StoryDraft with ID ${storyDraftId} not found`,
      );
    }
    return story.anthology.id;
  }

  /**
   * The publication an author edit is checked against: the one holding the
   * given draft. Rejects a draft that belongs to a different author, so a
   * user can't borrow edit rights from an unrelated publication.
   */
  async anthologyIdForAuthorEdit(
    authorId: number,
    storyDraftId: number,
  ): Promise<number> {
    const story = await this.storyRepo.findOne({
      where: { storyDraft: { id: storyDraftId } },
      relations: ['anthology', 'author'],
    });
    if (!story?.anthology) {
      throw new NotFoundException(
        `StoryDraft with ID ${storyDraftId} not found`,
      );
    }
    if (story.author?.id !== authorId) {
      throw new ForbiddenException(
        `StoryDraft ${storyDraftId} does not belong to author ${authorId}`,
      );
    }
    return story.anthology.id;
  }

  /** Anthology owns the FK to its production info. */
  async anthologyIdForProductionInfo(
    productionInfoId: number,
  ): Promise<number> {
    const anthology = await this.anthologyRepo.findOne({
      where: { productionInfo: { id: productionInfoId } },
    });
    if (!anthology) {
      throw new NotFoundException(
        `Production info with ID ${productionInfoId} not found`,
      );
    }
    return anthology.id;
  }

  async create(createOmchaiDto: CreateOmchaiDto, actor: OmchaiActor) {
    const { anthologyId, userId, role } = createOmchaiDto;
    await this.assertCanAssign(actor, anthologyId, role);
    await this.assertNotAssigned(anthologyId, [userId]);

    const omchai = this.repo.create(this.toEntity(createOmchaiDto));
    const saved = await this.saveOrConflict(() => this.repo.save(omchai));
    return this.repo.findOne({ where: { id: saved.id }, relations: ['user'] });
  }

  async createMany(createOmchaiDtos: CreateOmchaiDto[], actor: OmchaiActor) {
    if (createOmchaiDtos.length === 0) {
      return [];
    }

    const anthologyId = createOmchaiDtos[0].anthologyId;
    for (const role of new Set(createOmchaiDtos.map((dto) => dto.role))) {
      await this.assertCanAssign(actor, anthologyId, role);
    }

    const userIds = createOmchaiDtos.map((dto) => dto.userId);
    const repeated = userIds.find((id, i) => userIds.indexOf(id) !== i);
    if (repeated !== undefined) {
      throw new BadRequestException(
        `User ${repeated} is listed under more than one role. A person can hold only one role per publication.`,
      );
    }
    await this.assertNotAssigned(anthologyId, userIds);

    const omchais = this.repo.create(
      createOmchaiDtos.map((dto) => this.toEntity(dto)),
    );
    return this.saveOrConflict(() => this.repo.save(omchais));
  }

  findAll() {
    return this.repo.find();
  }

  findByAnthologyId(anthologyId: number) {
    return this.repo.find({
      where: { anthology: { id: anthologyId } },
      relations: ['user'],
    });
  }

  findByUserId(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['anthology', 'anthology.stories', 'anthology.stories.author'],
    });
  }

  async update(id: number, updateOmchaiDto: EditOmchaiDto, actor: OmchaiActor) {
    const omchai = await this.findAssignment(id);
    const anthologyId = omchai.anthology?.id;
    await this.assertCanAssign(actor, anthologyId, omchai.role);

    if (updateOmchaiDto.role && updateOmchaiDto.role !== omchai.role) {
      await this.assertCanAssign(actor, anthologyId, updateOmchaiDto.role);
      if (omchai.role === OmchaiRole.OWNER) {
        await this.assertNotLastOwner(anthologyId);
      }
    }

    Object.assign(omchai, updateOmchaiDto);
    return this.repo.save(omchai);
  }

  async remove(id: number, actor: OmchaiActor) {
    const omchai = await this.findAssignment(id);
    const anthologyId = omchai.anthology?.id;
    await this.assertCanAssign(actor, anthologyId, omchai.role);

    if (omchai.role === OmchaiRole.OWNER) {
      await this.assertNotLastOwner(anthologyId);
    }

    await this.repo.delete(id);
    return omchai;
  }

  // PUT/DELETE take an assignment id, so the publication comes from the row
  // rather than the route params OmchaiGuard reads
  private async findAssignment(id: number) {
    const omchai = await this.repo.findOne({
      where: { id },
      relations: ['anthology', 'user'],
    });

    if (!omchai) {
      throw new NotFoundException('Omchai not found');
    }
    return omchai;
  }

  private async assertCanAssign(
    actor: OmchaiActor,
    anthologyId: number | undefined,
    role: OmchaiRole,
  ) {
    if (actor?.role === Role.ADMIN) return;
    // A row with no publication would match every assignment in assertCan
    if (anthologyId === undefined) {
      throw new ForbiddenException('No role on this publication');
    }

    await this.assertCan(actor, anthologyId, [
      LEAD_ROLES.includes(role)
        ? OmchaiAction.MANAGE_LEADS
        : OmchaiAction.MANAGE_TEAM,
    ]);
  }

  private async assertNotAssigned(anthologyId: number, userIds: number[]) {
    const existing = await this.repo.findOne({
      where: { anthology: { id: anthologyId }, user: { id: In(userIds) } },
      relations: ['user'],
    });

    if (existing) {
      const name =
        `${existing.user.firstName} ${existing.user.lastName}`.trim();
      throw new ConflictException(
        `${name} is already ${
          ROLE_LABELS[existing.role]
        } on this publication. Remove them from that role first.`,
      );
    }
  }

  private async assertNotLastOwner(anthologyId: number | undefined) {
    if (anthologyId === undefined) return;

    const owners = await this.repo.count({
      where: { anthology: { id: anthologyId }, role: OmchaiRole.OWNER },
    });

    if (owners <= 1) {
      throw new BadRequestException(
        'A publication needs at least one Owner. Add another Owner before removing this one.',
      );
    }
  }

  // Backstop for a concurrent add slipping past assertNotAssigned
  private async saveOrConflict<T>(save: () => Promise<T>) {
    try {
      return await save();
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          'That person already has a role on this publication.',
        );
      }
      throw error;
    }
  }

  private toEntity(dto: CreateOmchaiDto) {
    return {
      role: dto.role,
      datetimeAssigned: dto.datetimeAssigned,
      user: { id: dto.userId },
      anthology: { id: dto.anthologyId },
    };
  }
}
