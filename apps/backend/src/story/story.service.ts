import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private repo: Repository<Story>) {}

  async create(
    title: string,
    author: string,
    student_bio?: string,
    description?: string,
    genre?: string,
    theme?: string,
    anthology_id?: number,
  ) {
    const storyId = (await this.repo.count()) + 1;
    const story = this.repo.create({
      id: storyId,
      title,
      author,
      student_bio,
      description,
      genre,
      theme,
      anthology_id,
    });

    return this.repo.save(story);
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

  findByTitle(title: string) {
    return this.repo.find({ where: { title } });
  }

  findByGenre(genre: string) {
    return this.repo.find({ where: { genre } });
  }

  findByTheme(theme: string) {
    return this.repo.find({ where: { theme } });
  }

  async update(id: number, attrs: Partial<Story>) {
    const story = await this.findOne(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    Object.assign(story, attrs);

    return this.repo.save(story);
  }

  async remove(id: number) {
    const story = await this.findOne(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return this.repo.remove(story);
  }
}
