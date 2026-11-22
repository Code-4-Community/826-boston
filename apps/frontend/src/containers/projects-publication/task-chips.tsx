import React from 'react';
import { AreaOfWork, Task } from '../../types';
import { AREA_OF_WORK_LABELS } from './tasks-format';

// Shared by the task list and the task side panel

export const PersonChip: React.FC<{
  person: NonNullable<Task['personInCharge']>;
}> = ({ person }) => (
  <span className="tasks-person">
    <span className="tasks-avatar">{person.firstName.charAt(0)}</span>
    {person.firstName} {person.lastName}
  </span>
);

export const AreaOfWorkBadge: React.FC<{ areaOfWork: AreaOfWork }> = ({
  areaOfWork,
}) => (
  <span className={`tasks-badge tasks-badge--${areaOfWork.toLowerCase()}`}>
    {AREA_OF_WORK_LABELS[areaOfWork]}
  </span>
);
