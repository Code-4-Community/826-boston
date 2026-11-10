import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArrayOverlap,
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';

import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import {
  AnthologySortOption,
  FilterSortAnthologyDto,
} from './dtos/filter-anthology.dto';
import { libraryWhere } from './library-eligibility';

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
  ) {}

  async create(
    title: string,
    description: string,
    pubLevel: AnthologyPubLevel,
    programs?: string[],
    photoUrl?: string,
    isbn?: string,
    shopifyUrl?: string,
    genres?: string[],
    themes?: string[],
    publishedDate?: Date,
  ) {
    const anthology = this.repo.create({
      title,
      description,
      pubLevel,
      programs,
      photoUrl,
      isbn,
      shopifyUrl,
      genres,
      themes,
      publishedDate,
    });

    return this.repo.save(anthology);
  }

  findOne(id: number, libraryOnly = false) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy(libraryOnly ? { id, ...libraryWhere } : { id });
  }

  findAll(libraryOnly = false) {
    return libraryOnly
      ? this.repo.find({ where: libraryWhere })
      : this.repo.find();
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

  async update(id: number, attrs: Partial<Anthology>) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    const updated = Object.assign(anthology, attrs);

    if (
      attrs.status !== undefined &&
      attrs.status !== AnthologyStatus.NOT_STARTED
    ) {
      const missingFields: string[] = [];
      if (!updated.title?.trim()) missingFields.push('title');
      if (!updated.description?.trim()) missingFields.push('description');
      if (!updated.genres?.length) missingFields.push('genres');
      if (!updated.programs?.length) missingFields.push('programs');
      if (!updated.pubLevel) missingFields.push('publication level');

      if (missingFields.length) {
        throw new BadRequestException({
          message: 'Required publication fields are missing',
          missingFields,
        });
      }
    }

    if (
      updated.status === AnthologyStatus.CAN_BE_SHARED &&
      (updated.pubLevel === AnthologyPubLevel.PERFECT_BOUND ||
        updated.pubLevel === AnthologyPubLevel.SIGNATURE) &&
      !updated.isbn?.trim()
    ) {
      throw new BadRequestException({
        message: 'An ISBN is required for this publication level',
        missingFields: ['ISBN'],
      });
    }

    // Only checked when the status is being changed, so unmarking release
    // forms on an already-shared publication is allowed (it just leaves the Library)
    if (
      attrs.status === AnthologyStatus.CAN_BE_SHARED &&
      !updated.releaseFormsOnFile
    ) {
      throw new BadRequestException({
        message:
          'Release forms must be on file before this publication can be shared',
        missingFields: ['release forms'],
      });
    }

    return this.repo.save(anthology);
  }

  async remove(id: number) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    return this.repo.remove(anthology);
  }

  // Goes through update() so status rules (e.g. release forms) can't be skipped
  async updateStatus(id: number, status: AnthologyStatus) {
    return this.update(id, { status });
  }

  findWithFilterSort(
    dto: FilterSortAnthologyDto,
    libraryOnly = false,
  ): Promise<Anthology[]> {
    const where: FindOptionsWhere<Anthology> = libraryOnly
      ? { ...libraryWhere }
      : {};
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
