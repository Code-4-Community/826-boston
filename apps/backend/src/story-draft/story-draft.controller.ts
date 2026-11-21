import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateStoryDraftDto } from './dto/create-story-draft.dto';
import { UpdateStoryDraftDto } from './dto/update-story-draft.dto';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';
import { UserStatus } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types';
import { OmchaiActor, OmchaiService } from 'src/omchai/omchai.service';
import { OmchaiAction, draftActionsFor } from 'src/auth/omchai-permissions';

type ActorRequest = Request & { user?: OmchaiActor };

@ApiTags('StoryDrafts')
@Controller('story-drafts')
export class StoryDraftController {
  constructor(
    private readonly storyDraftService: StoryDraftService,
    private readonly omchaiService: OmchaiService,
  ) {}

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all story drafts',
    description:
      'Retrieves a list of all story drafts in the system. Admin only.',
  })
  @ApiOkResponse({
    description: 'Story drafts retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          storyId: 5,
          docLink: 'https://docs.google.com',
          submissionRound: 'ROUND_ONE',
          studentConsent: true,
          inManuscript: false,
          editRound: 'ROUND_ONE',
          proofread: false,
          notes: ['Initial submission'],
          checkpoints: { draftOneSubmitted: true },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @Get()
  async getStoryDrafts() {
    return this.storyDraftService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new story draft',
    description:
      'Creates a new story draft with document link and metadata. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Story draft created successfully',
    schema: {
      example: {
        message: 'StoryDraft created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid story draft data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Document link is required',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Story not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Story with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Post()
  async createStoryDraft(
    @Body() createStoryDraftDto: CreateStoryDraftDto,
    @Req() req: ActorRequest,
  ): Promise<{ message: string }> {
    // Creating needs draft-edit rights, plus checkpoint or manuscript rights
    // if the new draft arrives with those fields already set.
    const anthologyId = await this.omchaiService.anthologyIdForStory(
      createStoryDraftDto.storyId,
    );
    await this.omchaiService.assertCan(req.user, anthologyId, [
      OmchaiAction.EDIT_DRAFTS,
      ...draftActionsFor(createStoryDraftDto),
    ]);

    await this.storyDraftService.create(
      createStoryDraftDto.docLink,
      createStoryDraftDto.submissionRound ?? SubmissionRound.ONE,
      createStoryDraftDto.studentConsent ?? false,
      createStoryDraftDto.inManuscript ?? false,
      createStoryDraftDto.editRound ?? EditRound.ONE,
      createStoryDraftDto.proofread ?? false,
      createStoryDraftDto.notes ?? [],
      createStoryDraftDto.storyId,
      createStoryDraftDto.checkpoints ?? {},
    );

    return { message: 'StoryDraft created successfully' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a story draft',
    description:
      'Partially updates an existing story draft with new metadata and document information. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Story draft updated successfully',
    schema: {
      example: {
        message: 'StoryDraft with id 5 updated successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Story draft not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'StoryDraft with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid submission round value',
        error: 'Bad Request',
      },
    },
  })
  @Patch('/:storyDraftId')
  async editStoryDraft(
    @Param('storyDraftId', ParseIntPipe) storyDraftId: number,
    @Body() updateStoryDraftDto: UpdateStoryDraftDto,
    @Req() req: ActorRequest,
  ): Promise<{ message: string }> {
    // One route saves edits, checkpoints and manuscript changes, so the
    // permission comes from which fields are present. The user needs every
    // permission the body touches; a body they can only partly write is
    // rejected whole. storyId is ignored by edit(), so it needs nothing.
    const anthologyId = await this.omchaiService.anthologyIdForStoryDraft(
      storyDraftId,
    );
    const actions = draftActionsFor(updateStoryDraftDto);
    await this.omchaiService.assertCan(
      req.user,
      anthologyId,
      actions.length > 0 ? actions : [OmchaiAction.EDIT_DRAFTS],
    );

    await this.storyDraftService.edit(
      storyDraftId,
      updateStoryDraftDto.docLink,
      updateStoryDraftDto.submissionRound,
      updateStoryDraftDto.studentConsent,
      updateStoryDraftDto.inManuscript,
      updateStoryDraftDto.editRound,
      updateStoryDraftDto.proofread,
      updateStoryDraftDto.notes,
      updateStoryDraftDto.checkpoints,
    );
    return {
      message: `StoryDraft with id ${storyDraftId} updated successfully`,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a story draft',
    description: 'Permanently removes a story draft. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Story draft deleted successfully',
    schema: {
      example: {
        message: 'StoryDraft deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Story draft not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'StoryDraft with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete('/:storyDraftId')
  async deleteStoryDraft(
    @Param('storyDraftId', ParseIntPipe) storyDraftId: number,
  ): Promise<{ message: string }> {
    await this.storyDraftService.remove(storyDraftId);
    return { message: 'StoryDraft deleted successfully' };
  }
}
