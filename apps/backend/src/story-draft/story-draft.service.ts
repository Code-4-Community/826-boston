import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoryDraft } from './story-draft.entity';
import { SubmissionRound, EditRound } from './types';

@Injectable()
export class StoryDraftService {
  constructor(
    @InjectRepository(StoryDraft) private repo: Repository<StoryDraft>,
  ) {}

  async create(
    docLink: string,
    submissionRound: SubmissionRound,
    studentConsent: boolean,
    inManuscript: boolean,
    editRound: EditRound,
    proofread: boolean,
    notes: string[],
    storyId: number, // assume story created before draft with other details, so we can link the draft to the story
  ) {
    const storyDraft = this.repo.create({
      docLink,
      submissionRound,
      studentConsent,
      inManuscript,
      editRound,
      proofread,
      notes,
      story: { id: storyId },
    });

    return await this.repo.save(storyDraft);
  }

  async edit(
    storyDraftId: number,
    docLink?: string,
    submissionRound?: SubmissionRound,
    studentConsent?: boolean,
    inManuscript?: boolean,
    editRound?: EditRound,
    proofread?: boolean,
    notes?: string[],
  ) {
    const storyDraft = await this.repo.findOne({ where: { id: storyDraftId } });
    if (!storyDraft) {
      throw new NotFoundException(`StoryDraft id ${storyDraftId} not found`);
    }

    if (docLink !== undefined) {
      storyDraft.docLink = docLink;
    }
    if (submissionRound !== undefined) {
      storyDraft.submissionRound = submissionRound;
    }
    if (studentConsent !== undefined) {
      storyDraft.studentConsent = studentConsent;
    }
    if (inManuscript !== undefined) {
      storyDraft.inManuscript = inManuscript;
    }
    if (editRound !== undefined) {
      storyDraft.editRound = editRound;
    }
    if (proofread !== undefined) {
      storyDraft.proofread = proofread;
    }
    if (notes !== undefined) {
      storyDraft.notes = notes;
    }

    return await this.repo.save(storyDraft);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  async findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const storyDraft = await this.findOne(id);

    if (!storyDraft) {
      throw new NotFoundException('StoryDraft not found');
    }

    return this.repo.remove(storyDraft);
  }
}
