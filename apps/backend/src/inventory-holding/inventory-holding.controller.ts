import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InventoryHoldingService } from './inventory-holding.service';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Inventory Holding')
@Controller('inventory-holding')
export class InventoryHoldingController {
  constructor(
    private readonly inventoryHoldingService: InventoryHoldingService,
  ) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createInventoryHoldingDto: CreateInventoryHoldingDto) {
    return this.inventoryHoldingService.create(createInventoryHoldingDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.inventoryHoldingService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('anthidologyId', ParseIntPipe) id: number) {
    return this.inventoryHoldingService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryHoldingDto: UpdateInventoryHoldingDto,
  ) {
    return this.inventoryHoldingService.update(+id, updateInventoryHoldingDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryHoldingService.remove(+id);
  }
}
