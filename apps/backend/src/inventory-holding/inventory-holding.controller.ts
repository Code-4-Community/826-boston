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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Inventory Holding')
@Controller('inventory-holding')
export class InventoryHoldingController {
  constructor(
    private readonly inventoryHoldingService: InventoryHoldingService,
  ) {}

  @ApiOperation({
    summary: 'Create a new inventory holding item',
    description:
      'Creates a new inventory holding item with provided details. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Inventory holding item created successfully',
    schema: {
      example: {
        id: 1,
        inventoryId: 12,
        anthologyId: 3,
        numCopies: 5,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid inventory holding data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Title is required',
        error: 'Bad Request',
      },
    },
  })
  @ApiBearerAuth()
  @Post()
  create(@Body() createInventoryHoldingDto: CreateInventoryHoldingDto) {
    return this.inventoryHoldingService.create(createInventoryHoldingDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all inventory holdings',
    description: 'Retrieves a list of all inventory holdings in the system.',
  })
  @ApiOkResponse({
    description: 'Inventory holdings retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          inventoryId: 12,
          anthologyId: 3,
          numCopies: 5,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.inventoryHoldingService.findAll();
  }

  @Public()
  @ApiOperation({
    summary: 'Get an inventory holding by ID',
    description: 'Retrieves a single inventory holding item by its ID.',
  })
  @ApiOkResponse({
    description: 'Inventory holding retrieved successfully',
    schema: {
      example: {
        id: 1,
        inventoryId: 12,
        anthologyId: 3,
        numCopies: 5,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory holding not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory holding with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id')
  findOne(@Param('anthologyId', ParseIntPipe) id: number) {
    return this.inventoryHoldingService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an inventory holding item',
    description:
      'Partially updates an inventory holding item with new details. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Inventory holding item updated successfully',
    schema: {
      example: {
        id: 1,
        inventoryId: 12,
        anthologyId: 3,
        numCopies: 8,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory holding not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory holding with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid inventory holding update data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'numCopies must be a positive number',
        error: 'Bad Request',
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryHoldingDto: UpdateInventoryHoldingDto,
  ) {
    return this.inventoryHoldingService.update(+id, updateInventoryHoldingDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an inventory holding item',
    description:
      'Permanently removes an inventory holding item. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Inventory holding item deleted successfully',
    schema: {
      example: {
        id: 1,
        inventoryId: 12,
        anthologyId: 3,
        numCopies: 5,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory holding not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Inventory holding with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryHoldingService.remove(id);
  }
}
