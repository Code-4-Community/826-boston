import { AreaOfWork, TaskStatus } from '../task/types';

export interface TaskSeedItem {
  anthology_id: number;
  person_in_charge_id?: number;
  name: string;
  note?: string;
  areaOfWork?: AreaOfWork;
  status: TaskStatus;
  timeFrame?: Date;
  dueBy?: Date;
}

export const TasksSeed: TaskSeedItem[] = [
  {
    anthology_id: 1,
    person_in_charge_id: 1,
    name: 'Draft Check-Point',
    areaOfWork: AreaOfWork.CHECKPOINT,
    status: TaskStatus.NOT_STARTED,
    timeFrame: new Date('2026-10-05'),
    dueBy: new Date('2026-10-10'),
  },
  {
    anthology_id: 2,
    person_in_charge_id: 2,
    name: 'Draft review',
    areaOfWork: AreaOfWork.PRODUCTION,
    status: TaskStatus.NOT_STARTED,
    timeFrame: new Date('2026-10-19'),
    dueBy: new Date('2026-10-20'),
  },
  {
    anthology_id: 1,
    person_in_charge_id: 3,
    name: 'Book Project Planning Discussion',
    note: 'Before a Publishing Project can begin, it must be discussed with the OWNER and APPROVERS. After project is approved, let INFORMED know',
    areaOfWork: AreaOfWork.PLANNING,
    status: TaskStatus.IN_PROGRESS,
    timeFrame: new Date('2026-07-06'),
    dueBy: new Date('2026-07-20'),
  },
  {
    anthology_id: 1,
    person_in_charge_id: 2,
    name: 'Description of book project',
    areaOfWork: AreaOfWork.PLANNING,
    status: TaskStatus.IN_PROGRESS,
    timeFrame: new Date('2026-09-28'),
    dueBy: new Date('2026-10-01'),
  },
  {
    anthology_id: 1,
    person_in_charge_id: 1,
    name: 'Add programming sessions to OMCHAI Timeline',
    areaOfWork: AreaOfWork.PROGRAMMING,
    status: TaskStatus.IN_PROGRESS,
    timeFrame: new Date('2026-10-12'),
    dueBy: new Date('2026-10-23'),
  },
  {
    anthology_id: 2,
    person_in_charge_id: 3,
    name: 'Intro to the program',
    areaOfWork: AreaOfWork.PROGRAMMING,
    status: TaskStatus.IN_PROGRESS,
    timeFrame: new Date('2026-10-19'),
    dueBy: new Date('2026-10-21'),
  },
  {
    anthology_id: 2,
    person_in_charge_id: 3,
    name: 'Workshop: Screenwriting',
    areaOfWork: AreaOfWork.PROGRAMMING,
    status: TaskStatus.IN_PROGRESS,
    timeFrame: new Date('2026-10-26'),
    dueBy: new Date('2026-10-30'),
  },
  {
    anthology_id: 2,
    person_in_charge_id: 1,
    name: 'Reach out to approver/informed to clarify roles',
    areaOfWork: AreaOfWork.PLANNING,
    status: TaskStatus.COMPLETE,
    timeFrame: new Date('2026-09-28'),
    dueBy: new Date('2026-10-04'),
  },
];
