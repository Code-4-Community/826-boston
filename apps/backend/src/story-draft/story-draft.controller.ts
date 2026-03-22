import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';
import { Roles } from '../auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';

@ApiTags('StoryDrafts')
@ApiBearerAuth()
@Controller('story-drafts')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class StoryDraftController {
  constructor(private readonly storyDraftService: StoryDraftService) {}

  @Post()
  async createStoryDraft(
    @Body() createStoryDraftDto: CreateStoryDraftDto,
  ): Promise<{ message: string }> {
    await this.storyDraftService.create(
      createStoryDraftDto.authorId,
      createStoryDraftDto.docLink,
      createStoryDraftDto.submissionRound,
      createStoryDraftDto.studentConsent,
      createStoryDraftDto.inManuscript,
      createStoryDraftDto.editRound,
      createStoryDraftDto.proofread,
      createStoryDraftDto.notes,
    );
    return { message: 'StoryDraft created successfully' };
  }

  @Post('/:storyDraftId')
  @Roles(
    OmchaiRole.OWNER,
    OmchaiRole.MANAGER,
    OmchaiRole.CONSULTED,
    OmchaiRole.HELPER,
  )
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
}
