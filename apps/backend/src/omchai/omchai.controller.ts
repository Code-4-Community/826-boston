import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { CreateOmchaiAssignmentsDto } from 'src/anthology/dtos/create-omchai-assignments-dto';
import { OmchaiRole } from './omchai.entity';
import { User } from 'src/users/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// OmchaiService looks the caller's role up in the database, so role changes
// apply on the next request
type AuthedRequest = Request & { user: User };

const FORBIDDEN_EXAMPLE = {
  description:
    'Caller is not an Admin, Owner or Manager on the publication, or is a non-Admin changing an Owner or Manager',
  schema: {
    example: {
      statusCode: 403,
      message: 'Role OWNER cannot do this on this publication',
      error: 'Forbidden',
    },
  },
};

const CONFLICT_EXAMPLE = {
  description: 'The user already holds a role on the publication',
  schema: {
    example: {
      statusCode: 409,
      message:
        'Bob Smith is already Consulted on this publication. Remove them from that role first.',
      error: 'Conflict',
    },
  },
};

@ApiTags('Omchai')
@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create an Omchai assignment',
    description:
      'Creates a single Omchai assignment linking a user to an anthology with a specific role. Admins can assign any role; Owners and Managers can assign Consulted, Helper, Approver and Informed.',
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
  @ApiForbiddenResponse(FORBIDDEN_EXAMPLE)
  @ApiConflictResponse(CONFLICT_EXAMPLE)
  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto, @Req() req: AuthedRequest) {
    return this.omchaiService.create(createOmchaiDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create batch Omchai assignments',
    description:
      'Creates many Omchai assignments for different role groups in a single request. Same role rules as creating a single assignment.',
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
  @ApiForbiddenResponse(FORBIDDEN_EXAMPLE)
  @ApiConflictResponse(CONFLICT_EXAMPLE)
  @Post('batch-assignments')
  createBatchAssignments(
    @Body() createOmchaiAssignmentsDto: CreateOmchaiAssignmentsDto,
    @Req() req: AuthedRequest,
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

    return this.omchaiService.createMany(createOmchaiDtos, req.user);
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
    summary: 'Get Omchai assignments for a user',
    description: 'Retrieves anthology assignments for a specific user.',
  })
  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.omchaiService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an Omchai assignment',
    description:
      'Updates the role or assignment date of an existing Omchai assignment. Same role rules as creating one, applied to both the current and the new role.',
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
  @ApiForbiddenResponse(FORBIDDEN_EXAMPLE)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() editOmchaiDto: EditOmchaiDto,
    @Req() req: AuthedRequest,
  ) {
    return this.omchaiService.update(id, editOmchaiDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove an Omchai assignment',
    description:
      'Removes a user from their role on a publication. Same role rules as creating an assignment. The last Owner of a publication cannot be removed.',
  })
  @ApiOkResponse({
    description: 'Omchai assignment removed; returns the removed assignment',
    schema: {
      example: {
        id: 1,
        role: 'HELPER',
        datetimeAssigned: '2025-01-15',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Omchai assignment not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Omchai not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Assignment is the publication's last Owner",
    schema: {
      example: {
        statusCode: 400,
        message:
          'A publication needs at least one Owner. Add another Owner before removing this one.',
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse(FORBIDDEN_EXAMPLE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedRequest) {
    return this.omchaiService.remove(id, req.user);
  }
}
