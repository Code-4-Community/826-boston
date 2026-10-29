import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import {
  AnthologySortOption,
  FilterSortAnthologyDto,
} from './dtos/filter-anthology.dto';

// escapes LIKE wildcards so user input is matched literally
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

// NOTE: ordering by expressions like LOWER() works with getMany() as long as the query
// has no joins combined with skip/take; revisit this if pagination is added
function applySort(
  qb: SelectQueryBuilder<Anthology>,
  sortBy: AnthologySortOption = AnthologySortOption.TITLE_ASC,
): void {
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
  ) {
    const anthology = this.repo.create({
      title,
      description,
      pubLevel,
      programs,
      photoUrl,
      isbn,
      shopifyUrl,
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

  async update(id: number, attrs: Partial<Anthology>) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

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

  // all filters combine with AND; empty lists and blank search are ignored
  findWithFilterSort(dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    const qb = this.repo.createQueryBuilder('a');

    if (dto.pubDateRange) {
      qb.andWhere('a.publishedDate BETWEEN :start AND :end', {
        start: new Date(dto.pubDateRange.start),
        end: new Date(dto.pubDateRange.end),
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

    applySort(qb, dto.sortBy);
    return qb.getMany();
  }
}
