import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { AuthGuard } from '@nestjs/passport';
import { Story } from './story.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnthologyService } from '../anthology/anthology.service';
import { AuthorService } from '../author/author.service';
import { CreateStoryDto } from './dtos/create-story.dto';
import { create } from 'domain';

@ApiTags('Story')
@ApiBearerAuth()
@Controller('story')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class StoryController {
  constructor(
    private storyService: StoryService,
    private anthologyService: AnthologyService,
    private authorService: AuthorService,
  ) {}

  @Get('/library/anthology/:anthologyId/story/:storyId')
  async getStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.findOne(storyId);
  }

  @Delete('/:storyId')
  async removeStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.remove(storyId);
  }

  @Delete('/library/anthology/story/:storyId')
  @ApiOperation({ summary: 'Delete a story from a specific anthology' })
  @ApiResponse({
    status: 200,
    description: 'Story deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Story not found',
  })
  async removeStoryFromAnthology(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<{ message: string }> {
    await this.storyService.remove(storyId);
    return { message: 'Story deleted successfully' };
  }

  @Post('/library/anthology/:anthologyId/story')
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
      createStoryDto.studentBio,
      createStoryDto.description,
      createStoryDto.genre,
      createStoryDto.theme,
    );
  }
}
