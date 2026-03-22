import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';

@ApiTags('Anthologies')
@ApiBearerAuth()
@Controller('anthologies')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

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

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }

  @Post()
  @Roles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
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

  @Patch(':id')
  @Roles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  async updateAnthology(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ): Promise<Anthology> {
    return this.anthologyService.update(id, updateAnthologyDto);
  }

  @Post(':id/publish')
  @Roles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  async publishAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology | { message: string }> {
    return this.anthologyService.publish(id);
  }
}
