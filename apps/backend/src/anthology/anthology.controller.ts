import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FilterSortAnthologyDto } from './dtos/filter-anthology.dto';
import { OmchaiRoles, Public, UserStatus } from '../auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';
import { Role } from 'src/users/types';
import { AwsS3Service } from '../aws/aws-s3.service';

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
import { AnthologyPubLevel, AnthologyStatus } from './types';

@ApiTags('Anthologies')
@Controller('anthologies')
export class AnthologyController {
  constructor(
    private readonly anthologyService: AnthologyService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Public()
  @ApiOperation({
    summary: 'Filter and sort anthologies',
    description:
      'Retrieves anthologies with optional filtering by publication date range, publication levels, programs, and genres. ' +
      'Results can be sorted by a specified field.',
  })
  @ApiOkResponse({
    description: 'Anthologies retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: '826 Spring Collection 2024',
          description: 'A collection of student works',
          status: 'published',
          pubLevel: 'public',
          programs: ['after-school'],
          photoUrl: 'https://example.com/photo.jpg',
          isbn: '978-1-234567-89-0',
          shopifyUrl: null,
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid filter parameters',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid date range format',
        error: 'Bad Request',
      },
    },
  })
  @Post('filter-sort')
  filterSort(@Body() dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    return this.anthologyService.findWithFilterSort(dto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all anthologies',
    description: 'Retrieves a list of all anthologies in the system.',
  })
  @ApiOkResponse({
    description: 'List of anthologies retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: '826 Spring Collection 2024',
          description: 'A collection of student works',
          status: 'published',
          pubLevel: 'public',
          programs: ['after-school'],
          photoUrl: 'https://example.com/photo.jpg',
          isbn: '978-1-234567-89-0',
          shopifyUrl: null,
        },
      ],
    },
  })
  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Public()
  @ApiOperation({
    summary: 'Get anthology by ID',
    description: 'Retrieves a single anthology by its unique ID.',
  })
  @ApiOkResponse({
    description: 'Anthology retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: '826 Spring Collection 2024',
        description: 'A collection of student works',
        status: 'published',
        pubLevel: 'public',
        programs: ['after-school'],
        photoUrl: 'https://example.com/photo.jpg',
        isbn: '978-1-234567-89-0',
        shopifyUrl: null,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id')
  async getAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    const anthology = await this.anthologyService.findOne(id);

    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${id} not found`);
    }

    return anthology;
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete an anthology',
    description:
      'Permanently removes an anthology and all associated data. Admin-only endpoint.',
  })
  @ApiOkResponse({
    description: 'Anthology deleted successfully',
    schema: {
      example: {
        message: 'Anthology deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new anthology',
    description:
      'Creates a new anthology with the provided metadata. Admin-only endpoint.',
  })
  @ApiCreatedResponse({
    description: 'Anthology created successfully',
    schema: {
      example: {
        id: 42,
        title: 'New Anthology 2024',
        description: 'A new collection of student works',
        status: 'draft',
        pubLevel: 'internal',
        programs: ['after-school', 'workshop'],
        photoUrl: null,
        isbn: null,
        shopifyUrl: null,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid anthology data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Title is required',
        error: 'Bad Request',
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAnthology(
    @Body() createAnthologyDto: CreateAnthologyDto,
  ): Promise<Anthology> {
    return this.anthologyService.create(
      createAnthologyDto.title,
      createAnthologyDto.description,
      createAnthologyDto.status as AnthologyStatus,
      createAnthologyDto.pub_level as AnthologyPubLevel,
      createAnthologyDto.programs,
      createAnthologyDto.photo_url,
      createAnthologyDto.isbn,
      createAnthologyDto.shopify_url,
    );
  }

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Update an anthology',
    description:
      'Partially updates an anthology with the provided fields. Requires OWNER or MANAGER role.',
  })
  @ApiOkResponse({
    description: 'Anthology updated successfully',
    schema: {
      example: {
        id: 42,
        title: 'Updated Anthology Title',
        description: 'Updated description',
        status: 'published',
        pubLevel: 'public',
        programs: ['after-school'],
        photoUrl: 'https://example.com/photo.jpg',
        isbn: '978-1-234567-89-0',
        shopifyUrl: 'https://shop.example.com/product',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid status value',
        error: 'Bad Request',
      },
    },
  })
  @Patch(':id')
  async updateAnthology(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ): Promise<Anthology> {
    return this.anthologyService.update(id, updateAnthologyDto);
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
  @ApiOperation({
    summary: 'Upload anthology cover image',
    description:
      'Uploads a cover image for an anthology. Accepts JPEG, PNG, GIF, or WebP images up to 5MB. Admin-only endpoint.',
  })
  @ApiOkResponse({
    description: 'Cover image uploaded successfully',
    schema: {
      example: {
        id: 42,
        title: 'Anthology Title',
        photoUrl: 'https://s3.example.com/images/42-1693456789.jpg',
        description: 'Description',
        status: 'published',
        pubLevel: 'public',
        programs: ['after-school'],
        isbn: null,
        shopifyUrl: null,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Anthology not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Anthology with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'File validation failed (invalid type or size)',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Validation failed - file must be an image (JPEG, PNG, GIF, WebP) and less than 5MB',
        error: 'Bad Request',
      },
    },
  })
  @Patch(':id/cover-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: UploadedFileType,
  ): Promise<Anthology> {
    const anthology = await this.anthologyService.findOne(id);
    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${id} not found`);
    }

    const ext = file.originalname.split('.').pop() || 'jpg';
    const key = `images/${id}-${Date.now()}.${ext}`;

    const url = await this.s3Service.uploadFile(
      file.buffer,
      key,
      file.mimetype,
    );
    return this.anthologyService.update(id, {
      photoUrl: url,
    } as UpdateAnthologyDto);
  }
}
