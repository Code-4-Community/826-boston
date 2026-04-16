import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InventoryHoldingService } from './inventory-holding.service';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserStatusGuard } from 'src/auth/guards/user-status.guard';
import { UserStatus } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types';

@Controller('inventory-holding')
export class InventoryHoldingController {
  constructor(
    private readonly inventoryHoldingService: InventoryHoldingService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN, Role.STANDARD)
  @Post()
  create(@Body() createInventoryHoldingDto: CreateInventoryHoldingDto) {
    return this.inventoryHoldingService.create(createInventoryHoldingDto);
  }

  @Get()
  findAll() {
    return this.inventoryHoldingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryHoldingService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryHoldingDto: UpdateInventoryHoldingDto,
  ) {
    return this.inventoryHoldingService.update(+id, updateInventoryHoldingDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UserStatus(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryHoldingService.remove(+id);
  }
}
