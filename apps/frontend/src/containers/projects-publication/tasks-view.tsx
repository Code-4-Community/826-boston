import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { AreaOfWork, Task, TaskStatus } from '../../types';
import PaperclipIcon from '../../assets/icons/paperclip.svg';
import ListViewIcon from '../../assets/icons/view-list.svg';
import BoardViewIcon from '../../assets/icons/view-board.svg';
import TimelineViewIcon from '../../assets/icons/view-timeline.svg';
import './tasks-view.css';

interface Props {
  anthologyId: number;
}

const AREA_OF_WORK_LABELS: Record<AreaOfWork, string> = {
  [AreaOfWork.PLANNING]: 'Planning',
  [AreaOfWork.PROGRAMMING]: 'Programming',
  [AreaOfWork.CHECKPOINT]: 'Checkpoint',
  [AreaOfWork.PRODUCTION]: 'Production',
};

// timeFrame and dueBy are YYYY-MM-DD strings. new Date() would read them as
// UTC midnight and show the previous day in Boston, so format their parts.
function formatTimeFrame(date: string): string {
  const [, month, day] = date.split('-');
  return `Week of ${month}/${day}`;
}

function formatDueBy(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}/${day}/${year}`;
}

// Today as YYYY-MM-DD, so it compares directly with dueBy
function getToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

const TasksView: React.FC<Props> = ({ anthologyId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getTasks(anthologyId)
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [anthologyId]);

  if (loading) return <div className="tasks-loading">Loading...</div>;

  const today = getToday();
  // Open tasks first, soonest due date first, then completed tasks
  const sortedTasks = [...tasks].sort(
    (a, b) =>
      Number(a.status === TaskStatus.COMPLETE) -
        Number(b.status === TaskStatus.COMPLETE) ||
      a.dueBy.localeCompare(b.dueBy),
  );

  return (
    <>
      <div className="tasks-toolbar">
        <button type="button" className="documents-filter-btn">
          <svg
            className="documents-filter-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <span>Filters</span>
        </button>

        <div className="tasks-view-toggle">
          <button
            type="button"
            className="tasks-view-btn tasks-view-btn--active"
            aria-label="List view"
            aria-pressed="true"
          >
            <img src={ListViewIcon} alt="" />
          </button>
          <button
            type="button"
            className="tasks-view-btn"
            aria-label="Board view"
            disabled
          >
            <img src={BoardViewIcon} alt="" />
          </button>
          <button
            type="button"
            className="tasks-view-btn"
            aria-label="Timeline view"
            disabled
          >
            <img src={TimelineViewIcon} alt="" />
          </button>
        </div>
      </div>

      <table className="document-tracker-table tasks-table">
        <thead>
          <tr>
            <th>
              <div className="tasks-task-head">
                <button
                  type="button"
                  className="documents-add-btn"
                  aria-label="Add task"
                >
                  +
                </button>
                Task
              </div>
            </th>
            <th>Area of Work</th>
            <th>Person in Charge</th>
            <th className="tasks-col-right">Time Frame</th>
            <th className="tasks-col-right">Due By</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="documents-empty">
                No tasks yet.
              </td>
            </tr>
          ) : (
            sortedTasks.map((task) => {
              const complete = task.status === TaskStatus.COMPLETE;
              const overdue = !complete && task.dueBy < today;

              return (
                <tr
                  key={task.id}
                  className={complete ? 'tasks-row--complete' : undefined}
                >
                  <td>
                    <div className="tasks-name">
                      <span>{task.name}</span>
                      {task.attachments.length > 0 && (
                        <img
                          className="tasks-paperclip"
                          src={PaperclipIcon}
                          alt="Has attachments"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    {task.areaOfWork && (
                      <span
                        className={`tasks-badge tasks-badge--${task.areaOfWork.toLowerCase()}`}
                      >
                        {AREA_OF_WORK_LABELS[task.areaOfWork]}
                      </span>
                    )}
                  </td>
                  <td>
                    {task.personInCharge && (
                      <div className="tasks-person">
                        <span className="tasks-avatar">
                          {task.personInCharge.firstName.charAt(0)}
                        </span>
                        {task.personInCharge.firstName}{' '}
                        {task.personInCharge.lastName}
                      </div>
                    )}
                  </td>
                  <td className="tasks-col-right">
                    {formatTimeFrame(task.timeFrame)}
                  </td>
                  <td
                    className={`tasks-col-right${
                      overdue ? ' tasks-due--overdue' : ''
                    }`}
                  >
                    {formatDueBy(task.dueBy)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};

export default TasksView;
