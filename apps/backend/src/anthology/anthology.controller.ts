import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Anthologies')
@ApiBearerAuth()
@Controller('anthologies')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AnthologyController {
  constructor(private anthologyService: AnthologyService) {}

  @Get('/:id')
  async getAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    return this.anthologyService.findOne(id);
  }

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Delete('/:id')
  removeAnthology(@Param('id') id: string) {
    return this.anthologyService.remove(parseInt(id));
  }
}
