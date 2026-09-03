import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { CreateOmchaiAssignmentsDto } from 'src/anthology/dtos/create-omchai-assignments-dto';
import { OmchaiRole } from './omchai.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Omchai')
@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create an Omchai assignment',
    description:
      'Creates a single Omchai assignment linking a user to an anthology with a specific role. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Omchai assignment created successfully',
    schema: {
      example: {
        id: 1,
        anthologyId: 3,
        userId: 19,
        role: 'OWNER',
        datetimeAssigned: '2025-01-15',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid Omchai payload provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'anthologyId is required',
        error: 'Bad Request',
      },
    },
  })
  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto) {
    return this.omchaiService.create(createOmchaiDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create batch Omchai assignments',
    description:
      'Creates many Omchai assignments for different role groups in a single request. Requires authentication.',
  })
  @ApiCreatedResponse({
    description: 'Batch Omchai assignments created successfully',
    schema: {
      example: [
        {
          id: 1,
          anthologyId: 3,
          userId: 19,
          role: 'OWNER',
          datetimeAssigned: '2025-01-15',
        },
        {
          id: 2,
          anthologyId: 3,
          userId: 20,
          role: 'MANAGER',
          datetimeAssigned: '2025-01-15',
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid batch assignment payload provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'owners, managers, or consulted arrays may not be empty',
        error: 'Bad Request',
      },
    },
  })
  @Post('batch-assignments')
  createBatchAssignments(
    @Body() createOmchaiAssignmentsDto: CreateOmchaiAssignmentsDto,
  ) {
    const createOmchaiDtos: CreateOmchaiDto[] = [];

    function createOmchaiDtosByRole(userIds: number[], role: OmchaiRole) {
      userIds.forEach((userId) => {
        createOmchaiDtos.push({
          anthologyId: createOmchaiAssignmentsDto.anthologyId,
          userId: userId,
          role: role,
          datetimeAssigned: createOmchaiAssignmentsDto.datetimeAssigned,
        });
      });
    }

    createOmchaiDtosByRole(createOmchaiAssignmentsDto.owners, OmchaiRole.OWNER);
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.managers,
      OmchaiRole.MANAGER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.consulted,
      OmchaiRole.CONSULTED,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.helpers,
      OmchaiRole.HELPER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.approvers,
      OmchaiRole.APPROVER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.informers,
      OmchaiRole.INFORMED,
    );

    return this.omchaiService.createMany(createOmchaiDtos);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all Omchai assignments',
    description: 'Retrieves all Omchai assignments in the system.',
  })
  @ApiOkResponse({
    description: 'Omchai assignments retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          anthologyId: 3,
          userId: 19,
          role: 'OWNER',
          datetimeAssigned: '2025-01-15',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.omchaiService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Omchai assignments for an anthology',
    description: 'Retrieves all Omchai assignments for a specific anthology.',
  })
  @ApiOkResponse({
    description: 'Anthology Omchai assignments retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          anthologyId: 3,
          userId: 19,
          role: 'OWNER',
          datetimeAssigned: '2025-01-15',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'No Omchai assignments found for the anthology',
    schema: {
      example: {
        statusCode: 404,
        message: 'No Omchai assignments found for anthology 999',
        error: 'Not Found',
      },
    },
  })
  @Get('anthology/:anthologyId')
  findByAnthologyId(@Param('anthologyId', ParseIntPipe) anthologyId: number) {
    return this.omchaiService.findByAnthologyId(anthologyId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an Omchai assignment',
    description: 'Updates an existing Omchai assignment. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'Omchai assignment updated successfully',
    schema: {
      example: {
        id: 1,
        anthologyId: 3,
        userId: 19,
        role: 'MANAGER',
        datetimeAssigned: '2025-01-16',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Omchai assignment not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Omchai assignment with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid Omchai update payload provided',
    schema: {
      example: {
        statusCode: 400,
        message: 'role is required',
        error: 'Bad Request',
      },
    },
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() editOmchaiDto: EditOmchaiDto,
  ) {
    return this.omchaiService.update(id, editOmchaiDto);
  }
}
