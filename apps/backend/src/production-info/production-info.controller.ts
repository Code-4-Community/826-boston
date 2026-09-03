import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductionInfoService } from './production-info.service';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { ProductionInfo } from './production-info.entity';
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

@ApiTags('Production Info')
@Controller('production-info')
export class ProductionInfoController {
  constructor(private readonly productionInfoService: ProductionInfoService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create production info',
    description:
      'Creates new production metadata for a book or anthology. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Production info created successfully',
    schema: {
      example: {
        id: 1,
        design_files_link: 'https://cdn.example.com/designs/cover.pdf',
        cover_image_file_link: 'https://cdn.example.com/images/cover.jpg',
        binding_type: 'Hardcover',
        dimensions: '8.5 x 11 in',
        printing_cost: 250.5,
        print_run: 1000,
        weight_in_grams: 720,
        page_count: 120,
        printed_by: 'Boston Press',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid production info data provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid payload',
        error: 'Bad Request',
      },
    },
  })
  @Post()
  create(
    @Body() createProductionInfoDto: CreateProductionInfoDto,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.create(createProductionInfoDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all production info records',
    description: 'Retrieves a list of all production info records.',
  })
  @ApiOkResponse({
    description: 'Production info records retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          design_files_link: 'https://cdn.example.com/designs/cover.pdf',
          cover_image_file_link: 'https://cdn.example.com/images/cover.jpg',
          binding_type: 'Hardcover',
          dimensions: '8.5 x 11 in',
          printing_cost: 250.5,
          print_run: 1000,
          weight_in_grams: 720,
          page_count: 120,
          printed_by: 'Boston Press',
        },
      ],
    },
  })
  @Get()
  findAll(): Promise<ProductionInfo[]> {
    return this.productionInfoService.findAll();
  }

  @Public()
  @ApiOperation({
    summary: 'Get production info by anthology ID',
    description: 'Retrieves production metadata for a specific anthology.',
  })
  @ApiOkResponse({
    description: 'Production info retrieved successfully',
    schema: {
      example: {
        id: 1,
        design_files_link: 'https://cdn.example.com/designs/cover.pdf',
        cover_image_file_link: 'https://cdn.example.com/images/cover.jpg',
        binding_type: 'Hardcover',
        dimensions: '8.5 x 11 in',
        printing_cost: 250.5,
        print_run: 1000,
        weight_in_grams: 720,
        page_count: 120,
        printed_by: 'Boston Press',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Production info not found for the provided anthology ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Production info for anthology 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':anthologyId')
  findOneByAnthologyId(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.findOneByAnthologyId(anthologyId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update production info',
    description: 'Updates the production information for a given record. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Production info updated successfully',
    schema: {
      example: {
        id: 1,
        design_files_link: 'https://cdn.example.com/designs/cover-v2.pdf',
        cover_image_file_link: 'https://cdn.example.com/images/cover-v2.jpg',
        binding_type: 'Paperback',
        dimensions: '6 x 9 in',
        printing_cost: 180.25,
        print_run: 500,
        weight_in_grams: 410,
        page_count: 96,
        printed_by: 'Regional Printing',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Production info not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Production info with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid production info update payload',
    schema: {
      example: {
        statusCode: 400,
        message: 'At least one valid field is required',
        error: 'Bad Request',
      },
    },
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionInfoDto: UpdateProductionInfoDto,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.update(id, updateProductionInfoDto);
  }
}
