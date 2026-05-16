import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { Anthology } from 'src/anthology/anthology.entity';

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private repo: Repository<Story>) {}

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  async getStoriesByAnthology(anthologyId: number) {
    return this.repo.find({ where: { anthologyId: anthologyId } });
  }

  findByTitle(title: string) {
    return this.repo.find({ where: { title } });
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

  async findByAnthologyAndId(
    anthologyId: number,
    storyId: number,
  ): Promise<Story> {
    const story = await this.repo.findOne({
      where: {
        id: storyId,
        anthologyId: anthologyId,
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found in this anthology');
    }

    return story;
  }

  async createStory(
    title: string,
    anthologyId: number,
    authorId: number,
    studentBio?: string,
    description?: string,
  ): Promise<Story> {
    // TODO: security concern for not randomizing the primary key
    const storyId = (await this.repo.count()) + 1;
    const story = this.repo.create({
      id: storyId,
      title,
      studentBio,
      description,
      authorId,
      anthologyId,
    });

    await this.repo.save(story);

    return story;
  }
}
