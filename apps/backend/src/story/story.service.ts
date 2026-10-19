import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Story } from './story.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';
import {
  PaginatedStoryDocuments,
  StoryDocumentRow,
} from './dtos/story-document-row.dto';

// Author only stores a single `name`, so split on the last space.
// TODO: split Author.name into first/last name columns.
export function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = name.trim();
  const idx = trimmed.lastIndexOf(' ');
  if (idx === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.slice(0, idx),
    lastName: trimmed.slice(idx + 1),
  };
}

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

  async getDocumentsByAnthology(
    anthologyId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedStoryDocuments> {
    // TODO: confirm with the team whether this should only list stories that
    // have a draft. For now every story in the anthology is shown.
    const [stories, total] = await this.repo.findAndCount({
      where: { anthology: { id: anthologyId } },
      relations: ['author', 'storyDraft'],
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data: StoryDocumentRow[] = stories.map((story) => ({
      storyId: story.id,
      storyDraftId: story.storyDraft?.id ?? null,
      authorId: story.author.id,
      consent: story.storyDraft?.studentConsent ?? false,
      ...splitName(story.author.name),
      grade: story.author.grade ?? null,
      docLink: story.storyDraft?.docLink ?? null,
    }));

    return { data, total, page };
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
    studentBio?: string,
    description?: string,
    theme?: string,
    storyDraftId?: number,
  ): Promise<Story> {
    const story = this.repo.create({
      title,
      anthology: { id: anthologyId } as Anthology,
      author: { id: authorId } as Author,
      studentBio,
      description,
      theme,
      ...(storyDraftId
        ? { storyDraft: { id: storyDraftId } as StoryDraft }
        : {}),
    });

    return this.repo.save(story);
  }
}
