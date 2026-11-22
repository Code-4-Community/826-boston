import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository, SelectQueryBuilder } from 'typeorm';

import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import {
  AnthologySortOption,
  FilterSortAnthologyDto,
} from './dtos/filter-anthology.dto';
import { TrackerAnthologyDto } from './dtos/tracker-anthology.dto';
import { User } from '../users/user.entity';
import { Role } from '../users/types';

// escapes LIKE wildcards so user input is matched literally:
//   %  matches any run of characters, including none
//   _  matches exactly one character
//   \  is Postgres's default LIKE escape character, so a raw one would escape the next character
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

// NOTE: ordering by expressions like LOWER() works with getMany() as long as the query
// has no joins combined with skip/take; revisit this if pagination is added
function applySort(
  qb: SelectQueryBuilder<Anthology>,
  sortBy?: AnthologySortOption,
): void {
  // no sort chosen: don't impose a field, keep the natural order (oldest first)
  if (!sortBy) {
    qb.orderBy('a.id', 'ASC');
    return;
  }

  switch (sortBy) {
    case AnthologySortOption.TITLE_DESC:
      qb.orderBy('LOWER(a.title)', 'DESC');
      break;
    case AnthologySortOption.BYLINE_ASC:
      qb.orderBy("NULLIF(LOWER(a.byline), '')", 'ASC', 'NULLS LAST');
      break;
    case AnthologySortOption.BYLINE_DESC:
      qb.orderBy("NULLIF(LOWER(a.byline), '')", 'DESC', 'NULLS LAST');
      break;
    case AnthologySortOption.DATE_RECENT:
      qb.orderBy('a.publishedDate', 'DESC', 'NULLS LAST');
      break;
    case AnthologySortOption.DATE_OLDEST:
      qb.orderBy('a.publishedDate', 'ASC', 'NULLS LAST');
      break;
    default:
      qb.orderBy('LOWER(a.title)', 'ASC');
  }

  if (
    sortBy !== AnthologySortOption.TITLE_ASC &&
    sortBy !== AnthologySortOption.TITLE_DESC
  ) {
    qb.addOrderBy('LOWER(a.title)', 'ASC');
  }
  // tiebreak so equal rows keep a stable order
  qb.addOrderBy('a.id', 'ASC');
}

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

  findForTracker(dto: TrackerAnthologyDto, user: User): Promise<Anthology[]> {
    const where: FindOptionsWhere<Anthology> = {};

    if (dto.status) {
      where.status = dto.status;
    }

    if (user.role !== Role.ADMIN) {
      where.id = In(
        (user.omchaiAssignments ?? []).map(
          (assignment) => assignment.anthology.id,
        ),
      );
    }

    return this.repo.find({ where });
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

  // all filters combine with AND; empty lists and blank search are ignored
  findWithFilterSort(dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    const qb = this.repo.createQueryBuilder('a');

    if (dto.pubDateRange) {
      // The dates go in as the strings they are. As Date objects, '2026-02-03' is UTC
      // midnight, which is still the 2nd on a server west of UTC, so the range would
      // shift a day: the day before the start in, the end day out.
      qb.andWhere('a.publishedDate BETWEEN :start AND :end', {
        start: dto.pubDateRange.start,
        end: dto.pubDateRange.end,
      });
    }
    if (dto.pubLevels?.length) {
      qb.andWhere('a.pubLevel IN (:...pubLevels)', {
        pubLevels: dto.pubLevels,
      });
    }
    if (dto.genres?.length) {
      qb.andWhere('a.genres && :genres', { genres: dto.genres });
    }
    if (dto.programs?.length) {
      qb.andWhere('a.programs && :programs', { programs: dto.programs });
    }
    // unlike genres and programs, themes is still a comma-separated text column, and
    // older rows can hold the literal '[]' for "no themes"
    if (dto.themes?.length) {
      qb.andWhere("string_to_array(NULLIF(a.themes, '[]'), ',') && :themes", {
        themes: dto.themes,
      });
    }

    const search = dto.search?.trim();
    if (search) {
      qb.andWhere('a.title ILIKE :search', {
        search: `%${escapeLike(search)}%`,
      });
    }
    // EXISTS rather than a join so a publication with several matching staff appears once
    if (dto.staffIds?.length) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM omchais o WHERE o.anthology = a.id AND o."user" IN (:...staffIds))',
        { staffIds: dto.staffIds },
      );
    }
    // a holding row with zero copies means the location is out of stock, so it doesn't count
    if (dto.locationIds?.length) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM inventoryholdings h WHERE h.anthology = a.id AND h.inventory IN (:...locationIds) AND h."numCopies" > 0)',
        { locationIds: dto.locationIds },
      );
    }

    applySort(qb, dto.sortBy);
    return qb.getMany();
  }
}
