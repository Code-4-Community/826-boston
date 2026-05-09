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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  @Post('filter-sort')
  filterSort(@Body() dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    return this.anthologyService.findWithFilterSort(dto);
  }

  @Public()
  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Public()
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
  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
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
  @Patch(':id')
  async updateAnthology(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ): Promise<Anthology> {
    return this.anthologyService.update(id, updateAnthologyDto);
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
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
