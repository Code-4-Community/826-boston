import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductionInfoService } from './production-info.service';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { ProductionInfo } from './production-info.entity';
import { UserStatus } from 'src/auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserStatusGuard } from 'src/auth/guards/user-status.guard';
import { Role } from 'src/users/types';

@Controller('production-info')
export class ProductionInfoController {
  constructor(private readonly productionInfoService: ProductionInfoService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Post()
  create(
    @Body() createProductionInfoDto: CreateProductionInfoDto,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.create(createProductionInfoDto);
  }

  @Get()
  findAll(): Promise<ProductionInfo[]> {
    return this.productionInfoService.findAll();
  }

  @Get(':anthologyId')
  findOneByAnthologyId(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.findOneByAnthologyId(anthologyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionInfoDto: UpdateProductionInfoDto,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.update(id, updateProductionInfoDto);
  }
}
