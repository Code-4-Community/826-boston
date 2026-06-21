import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';

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
    return this.repo.find({
      where: { anthology: { id: anthologyId } },
      relations: ['storyDraft', 'author', 'anthology'],
    });
  }

  async getStoryDraftsByAnthology(anthologyId: number) {
    const stories = await this.repo.find({
      where: { anthology: { id: anthologyId } },
      relations: ['storyDraft', 'author'],
    });

    return stories.filter((story) => story.storyDraft !== null);
  }

  findByTitle(title: string) {
    return this.repo.find({ where: { title } });
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
        anthology: { id: anthologyId },
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
    description: string,
    storyDraftId?: number,
  ): Promise<Story> {
    const story = this.repo.create({
      title,
      anthology: { id: anthologyId } as Anthology,
      author: { id: authorId } as Author,
      description,
    });

    if (storyDraftId) {
      story.storyDraft = { id: storyDraftId } as StoryDraft;
    }

    return this.repo.save(story);
  }
}
