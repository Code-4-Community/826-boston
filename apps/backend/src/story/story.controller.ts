import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  NotFoundException,
  ParseBoolPipe,
  BadRequestException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AnthologyService } from '../anthology/anthology.service';
import { AuthorService } from '../author/author.service';
import { CreateStoryDto } from './dtos/create-story.dto';
import {
  DocumentCheckpoint,
  PaginatedStoryDocuments,
  StoryDocumentsFilters,
} from './dtos/story-document-row.dto';
import { Public } from 'src/auth/roles.decorator';

const MAX_DOCUMENTS_PAGE_SIZE = 100;
const DOCUMENT_CHECKPOINTS: DocumentCheckpoint[] = [
  'draft1',
  'draft2',
  'draft3',
  'consent',
  'authorApproval',
  'copyedit',
  'proofread',
];

function parseGrades(value?: string): number[] | undefined {
  if (!value) return undefined;

  const grades = value.split(',').map(Number);
  if (
    grades.length === 0 ||
    grades.some((grade) => !Number.isInteger(grade) || grade < 0)
  ) {
    throw new BadRequestException('grades must be comma-separated integers');
  }
  return [...new Set(grades)];
}

function parseCheckpoints(value?: string): DocumentCheckpoint[] | undefined {
  if (!value) return undefined;

  const checkpoints = value.split(',');
  if (
    checkpoints.some(
      (checkpoint) =>
        !DOCUMENT_CHECKPOINTS.includes(checkpoint as DocumentCheckpoint),
    )
  ) {
    throw new BadRequestException('invalid document checkpoint');
  }
  return [...new Set(checkpoints)] as DocumentCheckpoint[];
}

@ApiTags('Story')
@Controller('stories')
export class StoryController {
  constructor(
    private storyService: StoryService,
    private anthologyService: AnthologyService,
    private authorService: AuthorService,
  ) {}

  @Public()
  @ApiOperation({
    summary: 'Get stories by anthology',
    description:
      'Retrieves all stories that belong to a specific anthology by anthology ID.',
  })
  @ApiOkResponse({
    description: 'Stories retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'My Journey',
          authorId: 5,
          anthologyId: 10,
          description: 'A story about personal growth',
          studentBio: 'Student from local school',
          storyDraft: null,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get('/anthology/:anthologyId')
  async getStoriesByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<Story[]> {
    const stories = await this.storyService.getStoriesByAnthology(anthologyId);

    return stories;
  }

  @Public()
  @ApiOperation({
    summary: 'Get story documents table for an anthology',
    description:
      'Retrieves a paginated, flattened view of every story in an anthology ' +
      '(author name, grade, consent, and document link) for the publication Documents tab.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Rows per page (max 100)',
  })
  @ApiQuery({
    name: 'inManuscript',
    required: false,
    type: Boolean,
    description:
      'Optional. If true, only stories with an approved draft (inManuscript = true) are returned. If false, only stories with a draft that is not approved yet. If omitted, every story is returned.',
  })
  @ApiOkResponse({
    description: 'Story documents retrieved successfully',
    schema: {
      example: {
        data: [
          {
            storyId: 1,
            storyDraftId: 3,
            authorId: 5,
            consent: true,
            firstName: 'John',
            lastName: 'Doe',
            grade: 6,
            docLink: 'https://www.example.com/uhfouaofu',
          },
        ],
        total: 42,
        page: 1,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'page or limit is not a positive integer',
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get('/anthology/:anthologyId/documents')
  async getStoryDocumentsByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('grades') grades?: string,
    @Query('checkpoints') checkpoints?: string,
    @Query('inManuscript', new ParseBoolPipe({ optional: true }))
    inManuscript?: boolean,
  ): Promise<PaginatedStoryDocuments> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be positive integers');
    }
    // Keeps the row offset within what the database can handle
    if (!Number.isSafeInteger(page * MAX_DOCUMENTS_PAGE_SIZE)) {
      throw new BadRequestException('page is too large');
    }

    const filters: StoryDocumentsFilters = {
      grades: parseGrades(grades),
      checkpoints: parseCheckpoints(checkpoints),
      inManuscript,
    };

    const anthology = await this.anthologyService.findOne(anthologyId);
    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${anthologyId} not found`);
    }

    const safeLimit = Math.min(limit, MAX_DOCUMENTS_PAGE_SIZE);
    if (!grades && !checkpoints && inManuscript === undefined) {
      return this.storyService.getDocumentsByAnthology(
        anthologyId,
        page,
        safeLimit,
      );
    }

    return this.storyService.getDocumentsByAnthology(
      anthologyId,
      page,
      safeLimit,
      filters,
    );
  }

  @Public()
  @ApiOperation({
    summary: 'Get a specific story',
    description:
      'Retrieves a single story by its ID within a specific anthology.',
  })
  @ApiOkResponse({
    description: 'Story retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'My Journey',
        authorId: 5,
        anthologyId: 10,
        description: 'A story about personal growth',
        studentBio: 'Student from local school',
        storyDraft: null,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Story or anthology not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Story with ID 999 not found in Anthology 10',
        error: 'Not Found',
      },
    },
  })
  @Get('/library/anthology/:anthologyId/story/:storyId')
  async getStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.findByAnthologyAndId(anthologyId, storyId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a story',
    description:
      'Permanently removes a story and all associated data. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Story deleted successfully',
    schema: {
      example: {
        id: 1,
        title: 'My Journey',
        authorId: 5,
        anthologyId: 10,
        description: 'A story about personal growth',
        studentBio: 'Student from local school',
        storyDraft: null,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
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
  @Delete('/:storyId')
  async removeStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.remove(storyId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new story',
    description:
      'Creates a new story in a specific anthology. The anthology and author must exist. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Story created successfully',
    schema: {
      example: {
        id: 42,
        title: 'My Journey',
        authorId: 5,
        anthologyId: 10,
        description: 'A story about personal growth',
        studentBio: 'Student from local school',
        storyDraft: null,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology or author not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology or author not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid story data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Title is required',
        error: 'Bad Request',
      },
    },
  })
  @Post('/anthology/:anthologyId')
  /**
   * Create a new story in a specific anthology.
   *
   * @throws {NotFoundException} if the anthology or author does not exist.
   */
  async createStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    const anthology = await this.anthologyService.findOne(anthologyId);
    const author = await this.authorService.findOne(createStoryDto.authorId);
    if (!anthology || !author) {
      throw new NotFoundException('Anthology or author not found');
    }
    return this.storyService.createStory(
      createStoryDto.title,
      anthologyId,
      createStoryDto.authorId,
      createStoryDto.studentBio,
      createStoryDto.description,
    );
  }

  @Public()
  @ApiOperation({
    summary: 'Get story drafts for an anthology',
    description:
      'Retrieves all story drafts associated with stories in a specific anthology. Returns only non-null drafts.',
  })
  @ApiOkResponse({
    description: 'Story drafts retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          storyId: 5,
          content: 'Draft content of the story...',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiQuery({
    name: 'inManuscript',
    required: false,
    type: Boolean,
    description:
      'Optional. If true, only approved drafts (inManuscript = true) are returned. If false, only drafts that are not approved yet. If omitted, all drafts are returned.',
  })
  @Get('/anthology/:anthologyId/story-drafts')
  async getStoryDraftsByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Query('inManuscript', new ParseBoolPipe({ optional: true }))
    inManuscript?: boolean,
  ) {
    const stories = await this.storyService.getStoriesByAnthology(anthologyId);

    return stories
      .filter((story) => story.storyDraft)
      .filter(
        (story) =>
          inManuscript === undefined ||
          story.storyDraft?.inManuscript === inManuscript,
      )
      .map((story) => ({
        ...story.storyDraft,
        story: {
          id: story.id,
          title: story.title,
          author: story.author,
        },
      }));
  }
}
