import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
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
import { OmchaiAction } from 'src/auth/omchai-permissions';
import { OmchaiActor, OmchaiService } from 'src/omchai/omchai.service';

@ApiTags('Production Info')
@Controller('production-info')
export class ProductionInfoController {
  constructor(
    private readonly productionInfoService: ProductionInfoService,
    private readonly omchaiService: OmchaiService,
  ) {}

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
        designFilesLink: 'https://cdn.example.com/designs/cover.pdf',
        coverImageFileLink: 'https://cdn.example.com/images/cover.jpg',
        bindingType: 'Hardcover',
        dimensions: '8.5 x 11 in',
        printingCost: 250.5,
        printRun: 1000,
        weightInGrams: 720,
        pageCount: 120,
        printedBy: 'Boston Press',
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
  async create(
    @Body() createProductionInfoDto: CreateProductionInfoDto,
    @Req() req: Request & { user?: OmchaiActor },
  ): Promise<ProductionInfo> {
    await this.omchaiService.assertCan(
      req.user,
      createProductionInfoDto.anthologyId,
      [OmchaiAction.EDIT_PRODUCTION],
    );
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
          designFilesLink: 'https://cdn.example.com/designs/cover.pdf',
          coverImageFileLink: 'https://cdn.example.com/images/cover.jpg',
          bindingType: 'Hardcover',
          dimensions: '8.5 x 11 in',
          printingCost: 250.5,
          printRun: 1000,
          weightInGrams: 720,
          pageCount: 120,
          printedBy: 'Boston Press',
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
        designFilesLink: 'https://cdn.example.com/designs/cover.pdf',
        coverImageFileLink: 'https://cdn.example.com/images/cover.jpg',
        bindingType: 'Hardcover',
        dimensions: '8.5 x 11 in',
        printingCost: 250.5,
        printRun: 1000,
        weightInGrams: 720,
        pageCount: 120,
        printedBy: 'Boston Press',
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
    description:
      'Updates the production information for a given record. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Production info updated successfully',
    schema: {
      example: {
        id: 1,
        designFilesLink: 'https://cdn.example.com/designs/cover-v2.pdf',
        coverImageFileLink: 'https://cdn.example.com/images/cover-v2.jpg',
        bindingType: 'Paperback',
        dimensions: '6 x 9 in',
        printingCost: 180.25,
        printRun: 500,
        weightInGrams: 410,
        pageCount: 96,
        printedBy: 'Regional Printing',
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionInfoDto: UpdateProductionInfoDto,
    @Req() req: Request & { user?: OmchaiActor },
  ): Promise<ProductionInfo> {
    // :id is a production-info id, not an anthology id, so check the role
    // on the anthology that owns this record.
    const anthologyId = await this.omchaiService.anthologyIdForProductionInfo(
      id,
    );
    await this.omchaiService.assertCan(req.user, anthologyId, [
      OmchaiAction.EDIT_PRODUCTION,
    ]);
    // Moving the record to another anthology also needs rights there.
    const target = updateProductionInfoDto.anthologyId;
    if (target !== undefined && target !== anthologyId) {
      await this.omchaiService.assertCan(req.user, target, [
        OmchaiAction.EDIT_PRODUCTION,
      ]);
    }
    return this.productionInfoService.update(id, updateProductionInfoDto);
  }
}
