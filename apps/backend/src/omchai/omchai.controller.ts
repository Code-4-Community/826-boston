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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Omchai')
@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto) {
    return this.omchaiService.create(createOmchaiDto);
  }

  @ApiBearerAuth()
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
  @Get()
  findAll() {
    return this.omchaiService.findAll();
  }

  @ApiBearerAuth()
  @Get('anthology/:anthologyId')
  findByAnthologyId(@Param('anthologyId', ParseIntPipe) anthologyId: number) {
    return this.omchaiService.findByAnthologyId(anthologyId);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() editOmchaiDto: EditOmchaiDto,
  ) {
    return this.omchaiService.update(id, editOmchaiDto);
  }
}
