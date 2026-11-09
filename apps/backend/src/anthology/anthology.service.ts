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

  async findGenres(): Promise<string[]> {
    const anthologies = await this.repo.find({ select: { genres: true } });
    return [
      ...new Set(anthologies.flatMap((anthology) => anthology.genres)),
    ].sort();
  }

  async findInventoryLocations(): Promise<string[]> {
    const anthologies = await this.repo.find({
      relations: ['inventoryHoldings', 'inventoryHoldings.inventory'],
    });
    return [
      ...new Set(
        anthologies.flatMap((anthology) =>
          anthology.inventoryHoldings.map((holding) => holding.inventory.name),
        ),
      ),
    ].sort();
  }

  async findThemes(): Promise<string[]> {
    const anthologies = await this.repo.find({ select: { themes: true } });
    return [
      ...new Set(anthologies.flatMap((anthology) => anthology.themes)),
    ].sort();
  }

  async findPrograms(): Promise<string[]> {
    const anthologies = await this.repo.find({ select: { programs: true } });
    return [
      ...new Set(anthologies.flatMap((anthology) => anthology.programs)),
    ].sort();
  }

  async findByGenres(genres: string[]): Promise<Anthology[]> {
    return this.findWithFilterSort({ genres });
  }

  async findByInventoryLocations(
    inventoryLocations: string[],
  ): Promise<Anthology[]> {
    return this.findWithFilterSort({ inventoryLocations });
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

  async findWithFilterSort(dto: FilterSortAnthologyDto): Promise<Anthology[]> {
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
    if (dto.themes?.length) {
      where.themes = ArrayOverlap(dto.themes);
    }

    if (dto.sortBy === AnthologySortOption.TITLE_ASC) {
      order.title = 'ASC';
    } else if (dto.sortBy === AnthologySortOption.TITLE_DESC) {
      order.title = 'DESC';
    } else if (dto.sortBy === AnthologySortOption.AUTHOR_ASC) {
      order.byline = 'ASC';
    } else if (dto.sortBy === AnthologySortOption.AUTHOR_DESC) {
      order.byline = 'DESC';
    } else if (dto.sortBy === AnthologySortOption.DATE_RECENT) {
      order.publishedDate = 'DESC';
    } else if (dto.sortBy === AnthologySortOption.DATE_OLDEST) {
      order.publishedDate = 'ASC';
    }

    const anthologies = await this.repo.find({
      where,
      order,
      ...(dto.inventoryLocations?.length
        ? { relations: ['inventoryHoldings', 'inventoryHoldings.inventory'] }
        : {}),
    });

    if (!dto.inventoryLocations?.length) {
      return anthologies;
    }

    const locations = new Set(dto.inventoryLocations);
    return anthologies.filter((anthology) =>
      anthology.inventoryHoldings.some((holding) =>
        locations.has(holding.inventory.name),
      ),
    );
  }
}
