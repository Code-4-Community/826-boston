import React, { useEffect, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import { AreaOfWork, Task, TaskStatus } from '../../types';
import PaperclipIcon from '../../assets/icons/paperclip.svg';
import ListViewIcon from '../../assets/icons/view-list.svg';
import BoardViewIcon from '../../assets/icons/view-board.svg';
import TimelineViewIcon from '../../assets/icons/view-timeline.svg';
import StatusNotStartedIcon from '../../assets/icons/status-not-started.svg';
import StatusInProgressIcon from '../../assets/icons/status-in-progress.svg';
import StatusCompleteIcon from '../../assets/icons/status-complete.svg';
import TaskSidePanel from './task-side-panel';
import { AreaOfWorkBadge, PersonChip } from './task-chips';
import {
  AREA_OF_WORK_LABELS,
  formatDueBy,
  formatTimeFrame,
} from './tasks-format';
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
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [areas, setAreas] = useState<AreaOfWork[]>([]);
  const [personIds, setPersonIds] = useState<number[]>([]);
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [sortBy, setSortBy] = useState<
    'due-asc' | 'due-desc' | 'name-asc' | 'name-desc'
  >('due-asc');
  // The task open in the side panel, or a new one being filled in. Each new
  // one gets its own number, so one that is still being created when its panel
  // is closed can't take over a later one.
  const [panel, setPanel] = useState<
    { taskId: number } | { draft: number; status: TaskStatus } | null
  >(null);
  const drafts = useRef(0);
  // A save that failed after its panel was already closed
  const [error, setError] = useState<string | null>(null);

  const open = (
    next: { taskId: number } | { draft: number; status: TaskStatus },
  ) => {
    setError(null);
    setPanel(next);
  };

  const openNew = (status: TaskStatus = TaskStatus.NOT_STARTED) =>
    open({ draft: ++drafts.current, status });

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
  const draftStatus =
    panel && 'draft' in panel ? panel.status : TaskStatus.NOT_STARTED;
  const creating = draft !== null;
  // undefined when the open task is no longer in the list
  const openTask =
    panel && 'taskId' in panel
      ? tasks.find((t) => t.id === panel.taskId)
      : null;
  // Open tasks first, soonest due date first, then completed tasks
  const filteredTasks = tasks.filter(
    (task) =>
      (statusFilters.length === 0 || statusFilters.includes(task.status)) &&
      (areas.length === 0 ||
        (task.areaOfWork !== null &&
          task.areaOfWork !== undefined &&
          areas.includes(task.areaOfWork))) &&
      (personIds.length === 0 ||
        (task.personInCharge !== null &&
          personIds.includes(task.personInCharge.id))),
  );
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'due-desc') return b.dueBy.localeCompare(a.dueBy);
    return (
      Number(a.status === TaskStatus.COMPLETE) -
        Number(b.status === TaskStatus.COMPLETE) ||
      a.dueBy.localeCompare(b.dueBy)
    );
  });

  return (
    <>
      <div className="tasks-toolbar">
        <button
          type="button"
          className="documents-filter-btn"
          onClick={() => setFilterOpen(true)}
        >
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
            className={`tasks-view-btn${
              viewMode === 'list' ? ' tasks-view-btn--active' : ''
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <img src={ListViewIcon} alt="" />
          </button>
          <button
            type="button"
            className={`tasks-view-btn${
              viewMode === 'board' ? ' tasks-view-btn--active' : ''
            }`}
            aria-label="Board view"
            aria-pressed={viewMode === 'board'}
            onClick={() => setViewMode('board')}
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

      {filterOpen && (
        <div
          className="tasks-filter-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Sort and filter tasks"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="tasks-filter-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="tasks-filter-header">
              <h2>Sort and Filter Results</h2>
              <button
                type="button"
                aria-label="Close filter modal"
                onClick={() => setFilterOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="tasks-filter-body">
              <label>
                Sort
                <select
                  aria-label="Sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as
                        | 'due-asc'
                        | 'due-desc'
                        | 'name-asc'
                        | 'name-desc',
                    )
                  }
                >
                  <option value="due-asc">Due date: earliest first</option>
                  <option value="due-desc">Due date: latest first</option>
                  <option value="name-asc">Task name: A to Z</option>
                  <option value="name-desc">Task name: Z to A</option>
                </select>
              </label>
              <fieldset>
                <legend>Status</legend>
                {[
                  [TaskStatus.NOT_STARTED, 'Not Started'],
                  [TaskStatus.IN_PROGRESS, 'In Progress'],
                  [TaskStatus.COMPLETE, 'Complete'],
                ].map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(value as TaskStatus)}
                      onChange={() =>
                        setStatusFilters((current) =>
                          current.includes(value as TaskStatus)
                            ? current.filter((item) => item !== value)
                            : [...current, value as TaskStatus],
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Area of Work</legend>
                {Object.values(AreaOfWork).map((area) => (
                  <label key={area}>
                    <input
                      type="checkbox"
                      checked={areas.includes(area)}
                      onChange={() =>
                        setAreas((current) =>
                          current.includes(area)
                            ? current.filter((item) => item !== area)
                            : [...current, area],
                        )
                      }
                    />
                    {AREA_OF_WORK_LABELS[area]}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Person in Charge</legend>
                {[...tasks]
                  .filter(
                    (task, index, all) =>
                      task.personInCharge &&
                      all.findIndex(
                        (candidate) =>
                          candidate.personInCharge?.id ===
                          task.personInCharge?.id,
                      ) === index,
                  )
                  .map((task) => task.personInCharge!)
                  .map((person) => (
                    <label key={person.id}>
                      <input
                        type="checkbox"
                        checked={personIds.includes(person.id)}
                        onChange={() =>
                          setPersonIds((current) =>
                            current.includes(person.id)
                              ? current.filter((item) => item !== person.id)
                              : [...current, person.id],
                          )
                        }
                      />
                      {person.firstName} {person.lastName}
                    </label>
                  ))}
              </fieldset>
            </div>
            <div className="tasks-filter-footer">
              <button
                type="button"
                onClick={() => {
                  setAreas([]);
                  setPersonIds([]);
                  setStatusFilters([]);
                  setSortBy('due-asc');
                }}
              >
                Clear
              </button>
              <button type="button" onClick={() => setFilterOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="tasks-error" role="alert">
          {error}
        </p>
      )}

      {viewMode === 'board' ? (
        <div className="tasks-board" aria-label="Task board">
          {[
            {
              status: TaskStatus.NOT_STARTED,
              label: 'Not Started',
              icon: StatusNotStartedIcon,
              modifier: 'not-started',
            },
            {
              status: TaskStatus.IN_PROGRESS,
              label: 'In Progress',
              icon: StatusInProgressIcon,
              modifier: 'in-progress',
            },
            {
              status: TaskStatus.COMPLETE,
              label: 'Complete',
              icon: StatusCompleteIcon,
              modifier: 'complete',
            },
          ].map((column) => {
            const columnTasks = sortedTasks.filter(
              (task) => task.status === column.status,
            );
            return (
              <section
                className="tasks-board-column"
                key={column.status}
                aria-label={column.label}
              >
                <header className="tasks-board-column-header">
                  <span
                    className={`tasks-board-column-title tasks-board-column-title--${column.modifier}`}
                  >
                    <img src={column.icon} alt="" />
                    {column.label}
                  </span>
                  {canEdit && (
                    <button
                      type="button"
                      className="tasks-board-add"
                      aria-label={`Add task to ${column.label}`}
                      onClick={() => openNew(column.status)}
                    >
                      +
                    </button>
                  )}
                </header>
                <div className="tasks-board-cards">
                  {columnTasks.map((task) => {
                    const overdue =
                      task.status !== TaskStatus.COMPLETE && task.dueBy < today;
                    return (
                      <button
                        type="button"
                        key={task.id}
                        className={`tasks-board-card${
                          overdue ? ' tasks-board-card--overdue' : ''
                        }`}
                        onClick={() => open({ taskId: task.id })}
                      >
                        <div className="tasks-board-card-name">
                          <span>{task.name}</span>
                          {task.attachments.length > 0 && (
                            <img
                              className="tasks-paperclip"
                              src={PaperclipIcon}
                              alt="Has attachments"
                            />
                          )}
                        </div>
                        <div className="tasks-board-card-footer">
                          {task.personInCharge && (
                            <PersonChip person={task.personInCharge} />
                          )}
                          {task.areaOfWork && (
                            <AreaOfWorkBadge areaOfWork={task.areaOfWork} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
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
                      onClick={() => openNew()}
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
      )}

      {panel && openTask !== undefined && (
        <TaskSidePanel
          key={openTask ? openTask.id : `new-${draft}`}
          anthologyId={anthologyId}
          task={openTask}
          initialStatus={draftStatus}
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
