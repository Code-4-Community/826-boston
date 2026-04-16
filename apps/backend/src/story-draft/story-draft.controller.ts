import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OmchaiGuard } from 'src/auth/guards/omchai.guard';
import { UserStatusGuard } from 'src/auth/guards/user-status.guard';
import { UserStatus, OmchaiRoles } from 'src/auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { Role } from 'src/users/types';

@ApiTags('StoryDrafts')
@ApiBearerAuth()
@Controller('story-drafts')
export class StoryDraftController {
  constructor(private readonly storyDraftService: StoryDraftService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @Get()
  async getStoryDrafts() {
    return this.storyDraftService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard, OmchaiGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
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
