import React, { useEffect, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import { Task, TaskStatus } from '../../types';
import PaperclipIcon from '../../assets/icons/paperclip.svg';
import ListViewIcon from '../../assets/icons/view-list.svg';
import BoardViewIcon from '../../assets/icons/view-board.svg';
import TimelineViewIcon from '../../assets/icons/view-timeline.svg';
import TaskSidePanel from './task-side-panel';
import { AreaOfWorkBadge, PersonChip } from './task-chips';
import { formatDueBy, formatTimeFrame } from './tasks-format';
import './tasks-view.css';

interface Props {
  anthologyId: number;
  // Owner, Manager and admins; everyone else can open tasks but not change them
  canEdit?: boolean;
}

// Today as YYYY-MM-DD, so it compares directly with dueBy
function getToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

const TasksView: React.FC<Props> = ({ anthologyId, canEdit = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  // The task open in the side panel, or a new one being filled in. Each new
  // one gets its own number, so one that is still being created when its panel
  // is closed can't take over a later one.
  const [panel, setPanel] = useState<
    { taskId: number } | { draft: number } | null
  >(null);
  const drafts = useRef(0);
  // A save that failed after its panel was already closed
  const [error, setError] = useState<string | null>(null);

  const open = (next: { taskId: number } | { draft: number }) => {
    setError(null);
    setPanel(next);
  };

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
  const draft = panel && 'draft' in panel ? panel.draft : null;
  const creating = draft !== null;
  // undefined when the open task is no longer in the list
  const openTask =
    panel && 'taskId' in panel
      ? tasks.find((t) => t.id === panel.taskId)
      : null;
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

      {error && (
        <p className="tasks-error" role="alert">
          {error}
        </p>
      )}

      <table className="document-tracker-table tasks-table">
        <thead>
          <tr>
            <th>
              <div className="tasks-task-head">
                {canEdit && (
                  <button
                    type="button"
                    className="documents-add-btn"
                    aria-label="Add task"
                    onClick={() => open({ draft: ++drafts.current })}
                  >
                    +
                  </button>
                )}
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
          {creating && (
            <tr>
              <td colSpan={5}>New Task</td>
            </tr>
          )}
          {sortedTasks.length === 0 && !creating ? (
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
                  className={`documents-row${
                    complete ? ' tasks-row--complete' : ''
                  }`}
                  onClick={() => open({ taskId: task.id })}
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
                      <AreaOfWorkBadge areaOfWork={task.areaOfWork} />
                    )}
                  </td>
                  <td>
                    {task.personInCharge && (
                      <PersonChip person={task.personInCharge} />
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

      {panel && openTask !== undefined && (
        <TaskSidePanel
          key={openTask ? openTask.id : `new-${draft}`}
          anthologyId={anthologyId}
          task={openTask}
          canEdit={canEdit}
          onClose={() => setPanel(null)}
          // Replace only: a response that lands late can't bring back a
          // task that has since been deleted
          onSaved={(saved) =>
            setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)))
          }
          onCreated={(created) => {
            setTasks((prev) => [...prev, created]);
            // Open it, unless this draft's panel is no longer the open one
            setPanel((prev) =>
              prev && 'draft' in prev && prev.draft === draft
                ? { taskId: created.id }
                : prev,
            );
          }}
          onDeleted={(taskId) => {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            setPanel(null);
          }}
          onError={setError}
        />
      )}
    </>
  );
};

export default TasksView;
