import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoryDraft } from './story-draft.entity';
import { Author } from '../author/author.entity';
import { SubmissionRound, EditRound } from './types';

@Injectable()
export class StoryDraftService {
  constructor(
    @InjectRepository(StoryDraft) private repo: Repository<StoryDraft>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
  ) {}

  async create(
    authorId: number,
    docLink: string,
    submissionRound: SubmissionRound,
    studentConsent: boolean,
    inManuscript: boolean,
    editRound: EditRound,
    proofread: boolean,
    notes: string[],
    anthologyId: number, // add this
  ) {
    const author = await this.authorRepo.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`Author id ${authorId} not found`);
    }

    const storyDraft = this.repo.create({
      authorId,
      docLink,
      submissionRound,
      studentConsent,
      inManuscript,
      editRound,
      proofread,
      notes,
      anthologyId,
    });

    return await this.repo.save(storyDraft);
  }

  async edit(
    storyDraftId: number,
    authorId?: number,
    docLink?: string,
    submissionRound?: SubmissionRound,
    studentConsent?: boolean,
    inManuscript?: boolean,
    editRound?: EditRound,
    proofread?: boolean,
    notes?: string[],
  ) {
    const storyDraft = await this.repo.findOne({ where: { id: storyDraftId } });
    if (!storyDraft)
      throw new NotFoundException(`StoryDraft id ${storyDraftId} not found`);

    if (authorId !== undefined) {
      const author = await this.authorRepo.findOne({ where: { id: authorId } });
      if (!author) {
        throw new NotFoundException(`Author id ${authorId} not found`);
      }
      storyDraft.authorId = authorId;
    }
    if (docLink !== undefined) storyDraft.docLink = docLink;
    if (submissionRound !== undefined)
      storyDraft.submissionRound = submissionRound;
    if (studentConsent !== undefined)
      storyDraft.studentConsent = studentConsent;
    if (inManuscript !== undefined) storyDraft.inManuscript = inManuscript;
    if (editRound !== undefined) storyDraft.editRound = editRound;
    if (proofread !== undefined) storyDraft.proofread = proofread;
    if (notes !== undefined) storyDraft.notes = notes;

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

  async findByAnthology(anthologyId: number) {
    return this.repo.findBy({ anthologyId });
  }
}
