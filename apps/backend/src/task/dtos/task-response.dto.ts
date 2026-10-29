import { AreaOfWork, TaskStatus } from '../types';

export class TaskPersonInChargeDto {
  id: number;
  firstName: string;
  lastName: string;
}

export class TaskAttachmentDto {
  fileName: string;
  fileUrl: string;
}

export class TaskResponseDto {
  id: number;
  name: string;
  note?: string;
  areaOfWork?: AreaOfWork;
  status: TaskStatus;
  timeFrame?: Date;
  dueBy?: Date;
  createdAt: Date;
  updatedAt: Date;
  personInCharge: TaskPersonInChargeDto | null;
  attachments: TaskAttachmentDto[];
}
