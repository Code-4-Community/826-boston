import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArrayOverlap,
  Between,
  DataSource,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';

import { Anthology } from './anthology.entity';
import { OmchaiRole } from '../omchai/omchai.entity';
import { OmchaiService } from '../omchai/omchai.service';
import { User } from '../users/user.entity';
import { AnthologyStatus, AnthologyPubLevel } from './types';
import {
  AnthologySortOption,
  FilterSortAnthologyDto,
} from './dtos/filter-anthology.dto';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
    private dataSource: DataSource,
    private omchaiService: OmchaiService,
  ) {}

  async create(
    title: string,
    pubLevel: AnthologyPubLevel,
    ownerIds: number[],
    programs?: string[],
    publishedDate?: string,
  ) {
    // create an anthology and assign its owner in one all-or-nothing transaction
    // prevents accidentally creating an unassigned anthology if a failure occurs
    return this.dataSource.transaction(async (transactionManager) => {
      const owners = await transactionManager.findBy(User, {
        id: In(ownerIds),
      });
      if (owners.length !== ownerIds.length) {
        const foundIds = new Set(owners.map((owner) => owner.id));
        const missingIds = ownerIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Owners not found: ${missingIds.join(', ')}`,
        );
      }

      const transactionRepo = transactionManager.getRepository(Anthology);
      const newAnthology = transactionRepo.create({
        title,
        pubLevel,
        programs,
      });
      // only convert to a Date if a publishedDate was provided
      if (publishedDate) {
        newAnthology.publishedDate = new Date(publishedDate);
      }
      const anthology = await transactionRepo.save(newAnthology);

      await this.omchaiService.createMany(
        ownerIds.map((ownerId) => ({
          anthologyId: anthology.id,
          userId: ownerId,
          role: OmchaiRole.OWNER,
        })),
        transactionManager,
      );

      return anthology;
    });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  findByStatus(status: AnthologyStatus) {
    return this.repo.find({ where: { status } });
  }

  findByPubLevel(pubLevel: AnthologyPubLevel) {
    return this.repo.find({ where: { pubLevel } });
  }

  findByYear(publishedDate: Date) {
    return this.repo.find({ where: { publishedDate } });
  }

  async update(id: number, updateAnthologyDto: UpdateAnthologyDto) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    const { photo_url, shopify_url, pub_level, publicationDate, ...rest } =
      updateAnthologyDto;
    const attrs: Partial<Anthology> = { ...rest };

    // DTO fields use snake_case to match the create payload, but the entity's
    // TS properties (and therefore what TypeORM actually persists) are camelCase.
    // TODO: switch to consistent naming so we no longer need this block below
    if (photo_url !== undefined) attrs.photoUrl = photo_url;
    if (shopify_url !== undefined) attrs.shopifyUrl = shopify_url;
    if (pub_level !== undefined) attrs.pubLevel = pub_level;
    if (publicationDate) attrs.publishedDate = new Date(publicationDate);

    Object.assign(anthology, attrs);

    return this.repo.save(anthology);
  }

  async remove(id: number) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    return this.repo.remove(anthology);
  }

  async updateStatus(id: number, status: AnthologyStatus) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    anthology.status = status;
    return this.repo.save(anthology);
  }

  findWithFilterSort(dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    const where: FindOptionsWhere<Anthology> = {};
    const order: FindOptionsOrder<Anthology> = {};

    if (dto.pubDateRange) {
      where.publishedDate = Between(
        new Date(dto.pubDateRange.start),
        new Date(dto.pubDateRange.end),
      );
    }
    if (dto.pubLevels?.length) {
      where.pubLevel = In(dto.pubLevels);
    }
    if (dto.genres?.length) {
      where.genres = ArrayOverlap(dto.genres);
    }
    if (dto.programs?.length) {
      where.programs = ArrayOverlap(dto.programs);
    }

    if (dto.sortBy === AnthologySortOption.TITLE_ASC) {
      order.title = 'ASC';
    } else if (dto.sortBy === AnthologySortOption.DATE_RECENT) {
      order.publishedDate = 'DESC';
    } else if (dto.sortBy === AnthologySortOption.DATE_OLDEST) {
      order.publishedDate = 'ASC';
    }

    return this.repo.find({ where, order });
  }
}
