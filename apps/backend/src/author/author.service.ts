import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';

@Injectable()
export class AuthorService {
  constructor(@InjectRepository(Author) private repo: Repository<Author>) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const id = (await this.repo.count()) + 1;
    const author = await this.repo.create({
      id: id,
      name: createAuthorDto.name,
      nameInBook: createAuthorDto.nameInBook,
      classPeriod: createAuthorDto.classPeriod,
      bio: createAuthorDto.bio,
      grade: createAuthorDto.grade,
    });

    return this.repo.save(author);
  }

  async remove(id: number) {
    const author = await this.findOne(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.repo.remove(author);
  }

  async update(id: number, attrs: EditAuthorDto) {
    const author = await this.findOne(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }
    Object.assign(author, attrs);

    return this.repo.save(author);
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
}
