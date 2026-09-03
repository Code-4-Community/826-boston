import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
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
import { Public } from 'src/auth/roles.decorator';

@ApiTags('StoryDrafts')
@Controller('story-drafts')
export class StoryDraftController {
  constructor(private readonly storyDraftService: StoryDraftService) {}

  @Public()
  @ApiOperation({
    summary: 'Get all story drafts',
    description: 'Retrieves a list of all story drafts in the system.',
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
  ): Promise<{ message: string }> {
    await this.storyDraftService.create(
      createStoryDraftDto.docLink,
      createStoryDraftDto.submissionRound ?? SubmissionRound.ONE,
      createStoryDraftDto.studentConsent ?? false,
      createStoryDraftDto.inManuscript ?? false,
      createStoryDraftDto.editRound ?? EditRound.ONE,
      createStoryDraftDto.proofread ?? false,
      createStoryDraftDto.notes ?? [],
      createStoryDraftDto.storyId,
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
  ): Promise<{ message: string }> {
    await this.storyDraftService.edit(
      storyDraftId,
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
