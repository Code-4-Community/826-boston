import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';

@ApiTags('StoryDrafts')
@ApiBearerAuth()
@Controller('story-drafts')
export class StoryDraftController {
  constructor(private readonly storyDraftService: StoryDraftService) {}

  @Get()
  async getStoryDrafts() {
    return this.storyDraftService.findAll();
  }

  @Post()
  async createStoryDraft(
    @Body() createStoryDraftDto: CreateStoryDraftDto,
  ): Promise<{ message: string }> {
    await this.storyDraftService.create(
      createStoryDraftDto.authorId,
      createStoryDraftDto.docLink,
      createStoryDraftDto.submissionRound ?? SubmissionRound.ONE,
      createStoryDraftDto.studentConsent ?? false,
      createStoryDraftDto.inManuscript ?? false,
      createStoryDraftDto.editRound ?? EditRound.ONE,
      createStoryDraftDto.proofread ?? false,
      createStoryDraftDto.notes ?? [],
      createStoryDraftDto.anthologyId,
    );
    return { message: 'StoryDraft created successfully' };
  }

  @Post('/:storyDraftId')
  async editStoryDraft(
    @Param('storyDraftId', ParseIntPipe) storyDraftId: number,
    @Body() updateStoryDraftDto: UpdateStoryDraftDto,
  ): Promise<{ message: string }> {
    await this.storyDraftService.edit(
      storyDraftId,
      updateStoryDraftDto.authorId,
      updateStoryDraftDto.docLink,
      updateStoryDraftDto.submissionRound,
      updateStoryDraftDto.studentConsent,
      updateStoryDraftDto.inManuscript,
      updateStoryDraftDto.editRound,
      updateStoryDraftDto.proofread,
      updateStoryDraftDto.notes,
    );
    return {
      message: `StoryDraft with id ${storyDraftId} updated successfully`,
    };
  }

  @Delete('/:storyDraftId')
  async deleteStoryDraft(
    @Param('storyDraftId', ParseIntPipe) storyDraftId: number,
  ): Promise<{ message: string }> {
    await this.storyDraftService.remove(storyDraftId);
    return { message: 'StoryDraft deleted successfully' };
  }

  @Get('/anthology/:anthologyId')
  async getStoryDraftsByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ) {
    return this.storyDraftService.findByAnthology(anthologyId);
  }
}
