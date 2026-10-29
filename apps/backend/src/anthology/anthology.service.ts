import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
  ) {}

  async create(
    title: string,
    description: string,
    status: AnthologyStatus,
    pubLevel: AnthologyPubLevel,
    programs?: string[],
    photoUrl?: string,
    isbn?: string,
    shopifyUrl?: string,
  ) {
    const anthology = this.repo.create({
      title,
      description,
      status,
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
