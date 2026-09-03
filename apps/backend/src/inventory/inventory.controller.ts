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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new inventory',
    description: 'Creates a new inventory with provided details. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Inventory created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Sample Book',
        quantity: 10,
        location: 'Shelf A',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid inventory data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Title is required',
        error: 'Bad Request',
      },
    },
  })
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all inventories',
    description: 'Retrieves a list of all inventories in the system.',
  })
  @ApiOkResponse({
    description: 'Inventories retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'Sample Book',
          quantity: 10,
          location: 'Shelf A',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Public()
  @ApiOperation({
    summary: 'Get an inventory by ID',
    description: 'Retrieves a single inventory item by its ID.',
  })
  @ApiOkResponse({
    description: 'Inventory item retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: 'Sample Book',
        quantity: 10,
        location: 'Shelf A',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an inventory',
    description:
      'Partially updates an inventory with new details. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Inventory updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Sample Book Updated',
        quantity: 15,
        location: 'Shelf B',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Quantity must be a positive number',
        error: 'Bad Request',
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an inventory',
    description:
      'Permanently removes an inventory. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Inventory deleted successfully',
    schema: {
      example: {
        id: 1,
        title: 'Sample Book',
        quantity: 10,
        location: 'Shelf A',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}
