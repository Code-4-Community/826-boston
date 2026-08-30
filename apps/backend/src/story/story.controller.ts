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
@Controller('stories')
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
  @Get('/library/anthology/:anthologyId/story/:storyId')
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
  @Post('/library/anthology/:anthologyId/story')
  /**
   * Create a new story in a specific anthology.
   *
   * @throws {NotFoundException} if the anthology or author does not exist.
   */
  async createStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    const anthology = await this.anthologyService.findOne(
      anthologyId
    );
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
  @Get('/anthology/:anthologyId/story-drafts')
  async getStoryDraftsByAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ) {
    // get stories with given anthology id and map to get non-null story drafts
    const stories = await this.getStoriesByAnthology(anthologyId);
    return stories
      .map((story) => story.storyDraft)
      .filter((draft) => draft !== null);
  }
}
