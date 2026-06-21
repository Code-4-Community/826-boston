import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnthologyService } from '../anthology/anthology.service';
import { AuthorService } from '../author/author.service';
import { CreateStoryDto } from './dtos/create-story.dto';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Story')
@ApiBearerAuth()
@Controller('story')
export class StoryController {
  constructor(
    private storyService: StoryService,
    private anthologyService: AnthologyService,
    private authorService: AuthorService,
  ) {}

  @Public()
  @Get('/anthology/:anthologyId')
  async getStoriesByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<Story[]> {
    const stories = await this.storyService.getStoriesByAnthology(anthologyId);

    return stories;
  }

  @Public()
  @Get('/anthology/:anthologyId/story/:storyId')
  async getStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.findByAnthologyAndId(anthologyId, storyId);
  }

  @ApiBearerAuth()
  @Delete('/:storyId')
  async removeStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.remove(storyId);
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new story in a specific anthology' })
  @ApiResponse({
    status: 201,
    description: 'Story created successfully',
    type: Story,
  })
  @ApiResponse({
    status: 404,
    description: 'Anthology not found',
  })
  async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
    const anthology = await this.anthologyService.findOne(
      createStoryDto.anthologyId,
    );
    const author = await this.authorService.findOne(createStoryDto.authorId);
    if (!anthology || !author) {
      throw new NotFoundException('Anthology or author not found');
    }
    return this.storyService.createStory(
      createStoryDto.title,
      createStoryDto.anthologyId,
      createStoryDto.authorId,
      createStoryDto.description,
    );
  }

  @Public()
  @Get('/anthology/:anthologyId/story-drafts')
  async getStoryDraftsByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ) {
    return this.storyService.getStoryDraftsByAnthology(anthologyId);
  }
}
