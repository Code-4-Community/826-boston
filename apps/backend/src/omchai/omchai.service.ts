import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Omchai } from './omchai.entity';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { Story } from '../story/story.entity';
import { Anthology } from '../anthology/anthology.entity';
import { Role } from '../users/types';
import { OmchaiAction, roleCan } from '../auth/omchai-permissions';

/** The parts of request.user that permission checks need. */
export type OmchaiActor = { id?: number; role?: string } | undefined;

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

  async create(createOmchaiDto: CreateOmchaiDto) {
    const omchai = this.repo.create(createOmchaiDto);
    return this.repo.save(omchai);
  }

  async createMany(
    createOmchaiDtos: CreateOmchaiDto[],
    transactionManager?: EntityManager,
  ) {
    const targetRepo = transactionManager
      ? transactionManager.getRepository(Omchai)
      : this.repo;

    const omchais = createOmchaiDtos.map((dto) =>
      targetRepo.create({
        anthology: { id: dto.anthologyId },
        user: { id: dto.userId },
        role: dto.role,
        datetimeAssigned: dto.datetimeAssigned,
      }),
    );
    return targetRepo.save(omchais);
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

  async update(id: number, updateOmchaiDto: EditOmchaiDto) {
    const omchai = await this.repo.findOneBy({ id });

    if (!omchai) {
      throw new NotFoundException('Omchai not found');
    }

    Object.assign(omchai, updateOmchaiDto);
    return this.repo.save(omchai);
  }
}
