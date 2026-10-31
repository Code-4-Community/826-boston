import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { AreaOfWork, TaskStatus } from './types';
import { SortOrder, UploadedFileType } from 'src/shared/types';
import { OmchaiRoles } from 'src/auth/roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { TaskResponseDto } from './dtos/task-response.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
              id: 1,
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

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Create a task for an anthology',
    description:
      'Creates a task for an anthology. Restricted to anthology owners and managers.',
  })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Draft Check-Point',
        note: 'Collect first drafts from all classes',
        areaOfWork: 'CHECKPOINT',
        status: 'NOT_STARTED',
        timeFrame: '2026-10-05',
        dueBy: '2026-10-10',
        createdAt: '2026-10-01T12:00:00.000Z',
        updatedAt: '2026-10-01T12:00:00.000Z',
        personInCharge: { id: 1, firstName: 'John', lastName: 'Doe' },
        attachments: [],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload or unknown personInChargeId',
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be a string'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not an owner or manager on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @Post(':anthologyId/tasks')
  create(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.create(anthologyId, createTaskDto);
  }

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Partially updates a task. Restricted to anthology owners and managers.',
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Draft Check-Point',
        note: 'Collect first drafts from all classes',
        areaOfWork: 'CHECKPOINT',
        status: 'COMPLETE',
        timeFrame: '2026-10-05',
        dueBy: '2026-10-10',
        createdAt: '2026-10-01T12:00:00.000Z',
        updatedAt: '2026-10-08T12:00:00.000Z',
        personInCharge: { id: 1, firstName: 'John', lastName: 'Doe' },
        attachments: [
          {
            id: 1,
            fileName: 'First_Draft.pdf',
            fileUrl: 'tasks/attachments/First_Draft.pdf',
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid payload, null name or status, or unknown personInChargeId',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'status must be one of the following values: NOT_STARTED, IN_PROGRESS, COMPLETE',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not an owner or manager on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Task not found in this anthology',
    schema: {
      example: {
        statusCode: 404,
        message: 'Task with ID 1 not found in this anthology',
        error: 'Not Found',
      },
    },
  })
  @Patch(':anthologyId/tasks/:taskId')
  update(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.update(anthologyId, taskId, updateTaskDto);
  }

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Removes a task and its attachments. Restricted to anthology owners and managers.',
  })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      example: {
        message: 'Task deleted successfully',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not an owner or manager on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Task not found in this anthology',
    schema: {
      example: {
        statusCode: 404,
        message: 'Task with ID 1 not found in this anthology',
        error: 'Not Found',
      },
    },
  })
  @Delete(':anthologyId/tasks/:taskId')
  async remove(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<{ message: string }> {
    await this.taskService.remove(anthologyId, taskId);
    return { message: 'Task deleted successfully' };
  }

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Upload a task attachment',
    description:
      'Uploads a file to S3 and attaches it to a task. Restricted to anthology owners and managers.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Attachment uploaded successfully',
    schema: {
      example: {
        id: 1,
        name: 'Draft Check-Point',
        note: 'Collect first drafts from all classes',
        areaOfWork: 'CHECKPOINT',
        status: 'IN_PROGRESS',
        timeFrame: '2026-10-05',
        dueBy: '2026-10-10',
        createdAt: '2026-10-01T12:00:00.000Z',
        updatedAt: '2026-10-01T12:00:00.000Z',
        personInCharge: { id: 1, firstName: 'John', lastName: 'Doe' },
        attachments: [
          {
            id: 1,
            fileName: 'First_Draft.pdf',
            fileUrl:
              'https://bucket-name.s3.us-east-1.amazonaws.com/task-attachments/1-1-1759320000000.pdf',
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No file was uploaded',
    schema: {
      example: {
        statusCode: 400,
        message: 'File is required',
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not an owner or manager on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Task not found in this anthology',
    schema: {
      example: {
        statusCode: 404,
        message: 'Task with ID 1 not found in this anthology',
        error: 'Not Found',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post(':anthologyId/tasks/:taskId/attachments')
  async uploadAttachment(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @UploadedFile('file', ParseFilePipe) file: UploadedFileType,
  ): Promise<TaskResponseDto> {
    return this.taskService.uploadAttachment(anthologyId, taskId, file);
  }

  @ApiBearerAuth()
  @OmchaiRoles(OmchaiRole.OWNER, OmchaiRole.MANAGER)
  @ApiOperation({
    summary: 'Delete a task attachment',
    description:
      'Removes an attachment from a task. Restricted to anthology owners and managers.',
  })
  @ApiOkResponse({
    description: 'Attachment deleted successfully',
    schema: {
      example: {
        message: 'Attachment deleted successfully',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not an owner or manager on this anthology',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Attachment not found for this task in this anthology',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Attachment with ID 1 not found for this task in this anthology',
        error: 'Not Found',
      },
    },
  })
  @Delete(':anthologyId/tasks/:taskId/attachments/:attachmentId')
  async removeAttachment(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
  ): Promise<{ message: string }> {
    await this.taskService.removeAttachment(anthologyId, taskId, attachmentId);
    return { message: 'Attachment deleted successfully' };
  }
}
