import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserStatus } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserStatusGuard } from 'src/auth/guards/user-status.guard';

@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto) {
    return this.omchaiService.create(createOmchaiDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @Get()
  findAll() {
    return this.omchaiService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('anthology/:anthologyId')
  findByAnthologyId(@Param('anthologyId') anthologyId: string) {
    return this.omchaiService.findByAnthologyId(+anthologyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() editOmchaiDto: EditOmchaiDto) {
    return this.omchaiService.update(+id, editOmchaiDto);
  }
}
