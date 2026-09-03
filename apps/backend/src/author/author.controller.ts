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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Author')
@Controller('author')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new author',
    description:
      'Creates a new author with provided bio, name, and grade information. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Author created successfully',
    schema: {
      example: {
        id: 42,
        name: 'Jane Doe',
        bio: 'A young writer from Boston',
        grade: '10th Grade',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid author data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Name is required',
        error: 'Bad Request',
      },
    },
  })
  @Post()
  async createAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an author',
    description:
      'Partially updates an author with new bio, name, and/or grade information. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Author updated successfully',
    schema: {
      example: {
        id: 42,
        name: 'Jane Doe Updated',
        bio: 'An experienced writer from Boston',
        grade: '11th Grade',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Author not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Author with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid grade format',
        error: 'Bad Request',
      },
    },
  })
  @Put('/:authorId')
  async updateAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Body() editAuthorDto: EditAuthorDto,
  ): Promise<Author> {
    return this.authorService.update(authorId, editAuthorDto);
  }


  @Public()
  @ApiOperation({
    summary: 'Get an author by ID',
    description: 'Retrieves a single author by their ID.',
  })
  @ApiOkResponse({
    description: 'Author retrieved successfully',
    schema: {
      example: {
        id: 42,
        name: 'Jane Doe',
        bio: 'A young writer from Boston',
        grade: '10th Grade',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Author not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Author with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get('/:authorId')
  async getAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.authorService.findOne(authorId);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all authors',
    description: 'Retrieves a list of all authors in the system.',
  })
  @ApiOkResponse({
    description: 'Authors retrieved successfully',
    schema: {
      example: [
        {
          id: 42,
          name: 'Jane Doe',
          bio: 'A young writer from Boston',
          grade: '10th Grade',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @Get()
  async getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an author',
    description: 'Permanently removes an author. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Author deleted successfully',
    schema: {
      example: {
        id: 42,
        name: 'Jane Doe',
        bio: 'A young writer from Boston',
        grade: '10th Grade',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Author not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Author with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete('/:authorId')
  async removeAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<Author> {
    return this.authorService.remove(authorId);
  }
}
