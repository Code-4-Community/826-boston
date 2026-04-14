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
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterSortAnthologyDto } from './dtos/filter-anthology.dto';
import { OmchaiRoles, UserStatus } from '../auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';
import { Role } from 'src/users/types';

@ApiTags('Anthologies')
@Controller('anthologies')
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

  @Post('filter-sort')
  filterSort(@Body() dto: FilterSortAnthologyDto): Promise<Anthology[]> {
    return this.anthologyService.findWithFilterSort(dto);
  }

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

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
      createAnthologyDto.status,
      createAnthologyDto.pub_level,
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
}
