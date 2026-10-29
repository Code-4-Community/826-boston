import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { AreaOfWork, TaskStatus } from './types';
import { SortOrder } from 'src/shared/types';
import { OmchaiRoles } from 'src/auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { TaskResponseDto } from './dtos/task-response.dto';

@ApiTags('Tasks')
@Controller('anthologies')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @OmchaiRoles(...Object.values(OmchaiRole))
  @ApiOperation({
    summary: 'Get tasks for an anthology',
    description:
      'Retrieves all tasks for an anthology with the associated person in charge and attachments.',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: SortOrder,
    description: 'Sort direction for due date. Defaults to ascending.',
  })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'areaOfWork', required: false, enum: AreaOfWork })
  @ApiQuery({ name: 'personInChargeId', required: false, type: Number })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Draft Check-Point',
          note: null,
          areaOfWork: 'CHECKPOINT',
          status: 'NOT_STARTED',
          timeFrame: '2026-10-05',
          dueBy: '2026-10-10',
          createdAt: '2026-10-01T12:00:00.000Z',
          updatedAt: '2026-10-01T12:00:00.000Z',
          personInCharge: { id: 1, firstName: 'John', lastName: 'Doe' },
          attachments: [
            {
              fileName: 'First_Draft.pdf',
              fileUrl: 'tasks/attachments/First_Draft.pdf',
            },
          ],
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid sort, status, areaOfWork, or personInChargeId value',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (enum string is expected)',
        error: 'Bad Request',
      },
    },
  })
  // never returns a 404 because OmchaiGuard already checks for a missing anthology and returns a 403
  @ApiForbiddenResponse({
    description: 'User has no OMCHAI assignment on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @Get(':anthologyId/tasks')
  findByAnthologyId(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Query(
      'sort',
      new DefaultValuePipe(SortOrder.ASC),
      new ParseEnumPipe(SortOrder),
    )
    sort: SortOrder,
    @Query('status', new ParseEnumPipe(TaskStatus, { optional: true }))
    status?: TaskStatus,
    @Query('areaOfWork', new ParseEnumPipe(AreaOfWork, { optional: true }))
    areaOfWork?: AreaOfWork,
    @Query('personInChargeId', new ParseIntPipe({ optional: true }))
    personInChargeId?: number,
  ): Promise<TaskResponseDto[]> {
    return this.taskService.findByAnthologyId(
      anthologyId,
      sort,
      status,
      areaOfWork,
      personInChargeId,
    );
  }
}
