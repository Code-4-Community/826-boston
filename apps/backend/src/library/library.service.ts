import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Library } from './library.entity';
import { Anthology } from '../anthology/anthology.entity';

@Injectable()
export class LibraryService {
  constructor(@InjectRepository(Library) private repo: Repository<Library>) {}

  async create(anthologies: Anthology[]) {
    const libraryId = (await this.repo.count()) + 1;
    const library = this.repo.create({
      id: libraryId,
      anthologies: anthologies,
    });

    return this.repo.save(library);
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

  async update(id: number, attrs: Partial<Library>) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    Object.assign(library, attrs);

    return this.repo.save(library);
  }

  async remove(id: number) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    return this.repo.remove(library);
  }

  async addAnthology(id: number, anthology: Anthology | Anthology[]) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    library.anthologies.concat(anthology);
    return this.repo.save(library);
  }

  async removeAnthology(id: number, anthology: Anthology) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    library.anthologies.filter((a) => a !== anthology);
    return this.repo.save(library);
  }
}
