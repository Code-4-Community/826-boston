import React, { useEffect, useId, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import {
  AreaOfWork,
  Task,
  TaskBody,
  TaskReference,
  TaskStatus,
} from '../../types';
import { getErrorMessage } from './editable-cell';
import { AreaOfWorkBadge, PersonChip } from './task-chips';
import {
  AREA_OF_WORK_LABELS,
  formatDueBy,
  formatTimeFrame,
  weekStart,
} from './tasks-format';
import CloseIcon from '../../assets/icons/close.svg';
import PanelCollapseIcon from '../../assets/icons/panel-collapse.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import TrashActiveIcon from '../../assets/icons/trash-active.svg';
import AttachmentIcon from '../../assets/icons/attachment.svg';
import StatusNotStartedIcon from '../../assets/icons/status-not-started.svg';
import StatusInProgressIcon from '../../assets/icons/status-in-progress.svg';
import StatusCompleteIcon from '../../assets/icons/status-complete.svg';
import './task-side-panel.css';

type Person = NonNullable<Task['personInCharge']>;

/**
 * The fields on screen. Edits to an existing task go straight to the API; a
 * new task keeps them here until it has a name, time frame and due date.
 */
interface Values {
  name: string;
  note: string;
  areaOfWork: AreaOfWork | null;
  status: TaskStatus;
  person: Person | null;
  timeFrame: string;
  dueBy: string;
}

const EMPTY: Values = {
  name: '',
  note: '',
  areaOfWork: null,
  status: TaskStatus.NOT_STARTED,
  person: null,
  timeFrame: '',
  dueBy: '',
};

const STATUSES = [
  {
    value: TaskStatus.NOT_STARTED,
    label: 'Not Started',
    icon: StatusNotStartedIcon,
    modifier: 'not-started',
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: StatusInProgressIcon,
    modifier: 'in-progress',
  },
  {
    value: TaskStatus.COMPLETE,
    label: 'Complete',
    icon: StatusCompleteIcon,
    modifier: 'complete',
  },
];

function valuesOf(task: Task): Values {
  return {
    name: task.name,
    note: task.note ?? '',
    areaOfWork: task.areaOfWork ?? null,
    status: task.status,
    person: task.personInCharge,
    timeFrame: task.timeFrame,
    dueBy: task.dueBy,
  };
}

function toBody(patch: Partial<Values>): TaskBody {
  const body: TaskBody = {};
  if (patch.name !== undefined) body.name = patch.name;
  if (patch.note !== undefined) body.note = patch.note || null;
  if (patch.areaOfWork !== undefined) body.areaOfWork = patch.areaOfWork;
  if (patch.status !== undefined) body.status = patch.status;
  if (patch.person !== undefined) {
    body.personInChargeId = patch.person ? patch.person.id : null;
  }
  if (patch.timeFrame !== undefined) body.timeFrame = patch.timeFrame;
  if (patch.dueBy !== undefined) body.dueBy = patch.dueBy;
  return body;
}

// The API has no parent or sub-task data yet, so these controls are shown but
// can't be used until it does
const SUB_TASKS_UNAVAILABLE = "Sub-tasks aren't available yet.";

// A task listed under another: its status icon and name
const TaskReferenceRow: React.FC<{ reference: TaskReference }> = ({
  reference,
}) => (
  <>
    <img
      src={STATUSES.find((s) => s.value === reference.status)?.icon}
      alt=""
    />
    <span className="task-panel__reference-name">{reference.name}</span>
  </>
);

interface EditableTextProps {
  value: string;
  label: string;
  placeholder: string;
  className: string;
  multiline?: boolean;
  // An emptied value is put back instead of saved
  required?: boolean;
  readOnly: boolean;
  onCommit: (next: string) => void;
}

// Saves when the field loses focus, like the cells on the Production tab
const EditableText: React.FC<EditableTextProps> = ({
  value,
  label,
  placeholder,
  className,
  multiline = false,
  required = false,
  readOnly,
  onCommit,
}) => {
  const [text, setText] = useState(value);
  const cancelled = useRef(false);
  const focused = useRef(false);

  // A save that finishes while the field is being typed in must not overwrite it
  useEffect(() => {
    if (!focused.current) setText(value);
  }, [value]);

  const commit = () => {
    if (cancelled.current) {
      cancelled.current = false;
      return;
    }
    const next = text.trim();
    if (readOnly || next === value.trim() || (required && !next)) {
      setText(value);
      return;
    }
    onCommit(next);
  };

  const shared = {
    className,
    value: text,
    'aria-label': label,
    placeholder: readOnly ? undefined : placeholder,
    readOnly,
    onFocus: () => {
      focused.current = true;
    },
    onBlur: () => {
      focused.current = false;
      commit();
    },
  };

  if (multiline) {
    // The wrapper grows with the text (see task-side-panel.css), so the note
    // reads as flowing text rather than a fixed-height box
    return (
      <div className="task-panel__autosize" data-value={text}>
        <textarea
          {...shared}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              cancelled.current = true;
              setText(value);
              e.currentTarget.blur();
            }
          }}
        />
      </div>
    );
  }

  return (
    <input
      {...shared}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          cancelled.current = true;
          setText(value);
          e.currentTarget.blur();
        }
      }}
    />
  );
};

interface ClickToEditProps {
  label: string;
  placeholder: string;
  readOnly: boolean;
  // null when the field is empty
  display: React.ReactNode;
  children: (done: () => void) => React.ReactNode;
}

// Shows the value as text and swaps in an editor when it is clicked
const ClickToEdit: React.FC<ClickToEditProps> = ({
  label,
  placeholder,
  readOnly,
  display,
  children,
}) => {
  const [editing, setEditing] = useState(false);
  const valueId = useId();

  if (readOnly)
    return <span className="task-panel__text">{display ?? '—'}</span>;
  if (editing) return <>{children(() => setEditing(false))}</>;
  // The label names the button; the current value is read out as its description
  return (
    <button
      type="button"
      className="task-panel__edit"
      aria-label={`Edit ${label}`}
      aria-describedby={valueId}
      onClick={() => setEditing(true)}
    >
      <span id={valueId}>
        {display ?? (
          <span className="task-panel__placeholder">{placeholder}</span>
        )}
      </span>
    </button>
  );
};

interface DateEditorProps {
  label: string;
  value: string;
  onCommit: (next: string) => void;
  onDone: () => void;
}

// While a year is typed the input reports 0002, 0020, 0202 before 2026, so a
// date is saved on blur or Enter, not on every change, and only once its year
// has four digits.
const MIN_YEAR = 1000;

const DateEditor: React.FC<DateEditorProps> = ({
  label,
  value,
  onCommit,
  onDone,
}) => {
  const [text, setText] = useState(value);
  const cancelled = useRef(false);

  return (
    <input
      className="task-panel__control"
      type="date"
      autoFocus
      aria-label={label}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        onDone();
        if (!cancelled.current && Number(text.slice(0, 4)) >= MIN_YEAR) {
          onCommit(text);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          cancelled.current = true;
          e.currentTarget.blur();
        }
      }}
    />
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="task-panel__field">
    <dt className="task-panel__label">{label}</dt>
    <dd className="task-panel__value">{children}</dd>
  </div>
);

interface DeleteTaskModalProps {
  task: Task;
  deleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

// Same look as the document delete confirmation in documents-table
const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  deleting,
  error,
  onCancel,
  onConfirm,
}) => (
  <div className="documents-modal-overlay">
    <div
      className="documents-delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-delete-title"
    >
      <div className="documents-delete-modal-header">
        <h2 id="task-delete-title">Confirm deletion</h2>
        <button
          type="button"
          className="documents-delete-modal-close task-panel__modal-close"
          aria-label="Close confirmation modal"
          onClick={onCancel}
          disabled={deleting}
        >
          <img src={CloseIcon} alt="" />
        </button>
      </div>
      <p className="documents-delete-modal-message">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
      <div className="documents-delete-student">
        <h3>{task.name}</h3>
        {task.note && (
          <p className="documents-delete-description">{task.note}</p>
        )}
        <dl>
          <div>
            <dt>Area of Work</dt>
            <dd>
              {task.areaOfWork ? (
                <AreaOfWorkBadge areaOfWork={task.areaOfWork} />
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt>Person in Charge</dt>
            <dd>
              {task.personInCharge ? (
                <PersonChip person={task.personInCharge} />
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt>Time frame</dt>
            <dd>{formatTimeFrame(task.timeFrame)}</dd>
          </div>
          <div>
            <dt>Due by</dt>
            <dd>{formatDueBy(task.dueBy)}</dd>
          </div>
        </dl>
      </div>
      {error && (
        <p className="documents-delete-error" role="alert">
          {error}
        </p>
      )}
      <div className="documents-delete-modal-footer">
        <button
          type="button"
          className="documents-delete-cancel"
          onClick={onCancel}
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="documents-delete-confirm"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

interface Props {
  anthologyId: number;
  // null while a new task is being filled in
  task: Task | null;
  initialStatus?: TaskStatus;
  // Owner, Manager and admins; everyone else sees the task read-only
  canEdit: boolean;
  onClose: () => void;
  // An existing task after it was edited or given an attachment
  onSaved: (task: Task) => void;
  // A new task, once it has been created
  onCreated: (task: Task) => void;
  onDeleted: (taskId: number) => void;
  // A save that failed after this panel was closed, so it can't show it itself
  onError: (message: string) => void;
}

const TaskSidePanel: React.FC<Props> = ({
  anthologyId,
  task,
  initialStatus = TaskStatus.NOT_STARTED,
  canEdit,
  onClose,
  onSaved,
  onCreated,
  onDeleted,
  onError,
}) => {
  const [draft, setDraft] = useState<Values>({
    ...EMPTY,
    status: task?.status ?? initialStatus,
  });
  const [members, setMembers] = useState<Person[]>([]);
  // Saves and uploads run one after another, so their responses can't land out
  // of order; `pending` counts those queued or in flight.
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [pending, setPending] = useState(0);
  // The new task is being created. Its fields wait, since this panel is about
  // to be replaced by the saved task and would lose anything typed meanwhile.
  const [creating, setCreating] = useState(false);
  const createStarted = useRef(false);
  const mounted = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  // Sub-tasks come first in the design, but with none to show the attachments
  // are the useful tab to land on
  const [tab, setTab] = useState<'sub-tasks' | 'attachments'>(
    task?.subTasks?.length ? 'sub-tasks' : 'attachments',
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const values = task ? valuesOf(task) : draft;
  const editable = canEdit && !creating;

  // Set here rather than once at the start: React's StrictMode runs the
  // cleanup and then the effect again in development.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Only people on this publication's OMCHAI can be put in charge
  useEffect(() => {
    if (!canEdit) return;
    let cancelled = false;
    apiClient
      .getOmchaiByAnthology(anthologyId)
      .then((entries) => {
        if (cancelled) return;
        const byUser = new Map<number, Person>();
        entries.forEach(({ user }) => {
          if (user) {
            byUser.set(user.id, {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          }
        });
        setMembers([...byUser.values()]);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't load the people on this publication.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [anthologyId, canEdit]);

  // Someone since taken off the OMCHAI stays listed until the task is reassigned
  const personOptions =
    values.person && !members.some((m) => m.id === values.person?.id)
      ? [values.person, ...members]
      : members;

  // Runs the request once any before it have finished, and hands the task it
  // returns to `done`. Resolves to whether it worked. A failure is shown here,
  // or through onError if this panel has been closed by then.
  const run = (
    request: () => Promise<Task>,
    done: (task: Task) => void,
    describe: (message: string) => string = (message) => message,
  ): Promise<boolean> => {
    setPending((n) => n + 1);
    setError(null);
    const result = queue.current.then(async () => {
      try {
        done(await request());
        return true;
      } catch (err) {
        const message = describe(getErrorMessage(err));
        if (mounted.current) setError(message);
        else onError(message);
        return false;
      } finally {
        if (mounted.current) setPending((n) => n - 1);
      }
    });
    queue.current = result;
    return result;
  };

  // The controls are hidden without edit rights; this keeps the rule here too
  const change = async (patch: Partial<Values>) => {
    if (!canEdit) return;
    const next = { ...values, ...patch };
    if (next.timeFrame && next.dueBy && next.dueBy < next.timeFrame) {
      setError('Due by cannot be before the time frame.');
      return;
    }
    setError(null);

    if (task) {
      await run(
        () => apiClient.updateTask(anthologyId, task.id, toBody(patch)),
        onSaved,
      );
      return;
    }

    setDraft(next);
    if (next.name && next.timeFrame && next.dueBy && !createStarted.current) {
      createStarted.current = true;
      setCreating(true);
      const created = await run(
        () =>
          apiClient.createTask(anthologyId, {
            name: next.name,
            timeFrame: next.timeFrame,
            dueBy: next.dueBy,
            status: next.status,
            ...(next.note ? { note: next.note } : {}),
            ...(next.areaOfWork ? { areaOfWork: next.areaOfWork } : {}),
            ...(next.person ? { personInChargeId: next.person.id } : {}),
          }),
        onCreated,
        (message) =>
          `Couldn't create the task (${message}). Change any field to try again.`,
      );
      if (!created) {
        // Allow another try on the next change
        createStarted.current = false;
        if (mounted.current) setCreating(false);
      }
    }
  };

  const missing = [
    !values.name && 'name',
    !values.timeFrame && 'time frame',
    !values.dueBy && 'due by',
  ].filter((field): field is string => !!field);

  const pickStatus = (status: TaskStatus) => {
    if (!statusOpen) {
      setStatusOpen(true);
      return;
    }
    setStatusOpen(false);
    if (status !== values.status) void change({ status });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !task) return;
    await run(
      () => apiClient.uploadTaskAttachment(anthologyId, task.id, file),
      onSaved,
    );
  };

  const confirmDelete = async () => {
    if (!task) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // After any save still in flight, so nothing lands on a deleted task
      await queue.current;
      await apiClient.deleteTask(anthologyId, task.id);
      onDeleted(task.id);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  const shownStatuses = statusOpen
    ? STATUSES
    : STATUSES.filter((s) => s.value === values.status);

  return (
    <aside className="task-panel" aria-label="Task details">
      <div className="task-panel__top">
        <button
          type="button"
          className="task-panel__collapse"
          aria-label="Close task details"
          onClick={onClose}
        >
          <img src={PanelCollapseIcon} alt="" />
        </button>
        {pending > 0 && <span className="task-panel__saving">Saving…</span>}
      </div>

      <div className="task-panel__status-row">
        <div className="task-panel__statuses" role="group" aria-label="Status">
          {shownStatuses.map((s) => {
            const className = `task-panel__status task-panel__status--${s.modifier}`;
            const label = (
              <>
                <img src={s.icon} alt="" />
                {s.label}
              </>
            );
            return editable ? (
              <button
                key={s.value}
                type="button"
                className={className}
                title={statusOpen ? undefined : 'Change status'}
                onClick={() => pickStatus(s.value)}
              >
                {label}
              </button>
            ) : (
              <span key={s.value} className={className}>
                {label}
              </span>
            );
          })}
        </div>
        {canEdit && task && (
          <button
            type="button"
            className={`task-panel__trash${
              confirmingDelete ? ' task-panel__trash--active' : ''
            }`}
            aria-label="Delete task"
            onClick={() => setConfirmingDelete(true)}
          >
            <img className="task-panel__trash-icon" src={TrashIcon} alt="" />
            <img
              className="task-panel__trash-icon task-panel__trash-icon--active"
              src={TrashActiveIcon}
              alt=""
            />
          </button>
        )}
      </div>

      <div className="task-panel__heading">
        <EditableText
          className="task-panel__title"
          label="Task name"
          placeholder="New Task"
          value={values.name}
          required
          readOnly={!editable}
          onCommit={(name) => void change({ name })}
        />
        <EditableText
          className="task-panel__note"
          label="Note"
          placeholder="Note"
          value={values.note}
          multiline
          readOnly={!editable}
          onCommit={(note) => void change({ note })}
        />
      </div>

      {!task && missing.length > 0 && (
        <p className="task-panel__missing">
          Still needed to create this task: {missing.join(', ')}.
        </p>
      )}
      {error && (
        <p className="task-panel__error" role="alert">
          {error}
        </p>
      )}

      <dl className="task-panel__fields">
        <Field label="Parent">
          {task?.parentTask ? (
            <span className="task-panel__reference">
              <TaskReferenceRow reference={task.parentTask} />
            </span>
          ) : (
            <span
              className="task-panel__text task-panel__placeholder"
              aria-disabled={canEdit ? true : undefined}
              title={canEdit ? SUB_TASKS_UNAVAILABLE : undefined}
            >
              {canEdit ? 'Add a parent task.' : '—'}
            </span>
          )}
        </Field>

        <Field label="Area of Work">
          <ClickToEdit
            label="area of work"
            placeholder="Add area of work."
            readOnly={!editable}
            display={
              values.areaOfWork && (
                <AreaOfWorkBadge areaOfWork={values.areaOfWork} />
              )
            }
          >
            {(done) => (
              <select
                className="task-panel__control"
                autoFocus
                aria-label="Area of work"
                value={values.areaOfWork ?? ''}
                onChange={(e) => {
                  done();
                  void change({
                    areaOfWork: (e.target.value || null) as AreaOfWork | null,
                  });
                }}
                onBlur={done}
              >
                <option value="">None</option>
                {Object.values(AreaOfWork).map((area) => (
                  <option key={area} value={area}>
                    {AREA_OF_WORK_LABELS[area]}
                  </option>
                ))}
              </select>
            )}
          </ClickToEdit>
        </Field>

        <Field label="Person in Charge">
          <ClickToEdit
            label="person in charge"
            placeholder="Add staff member."
            readOnly={!editable}
            display={values.person && <PersonChip person={values.person} />}
          >
            {(done) => (
              <select
                className="task-panel__control"
                autoFocus
                aria-label="Person in charge"
                value={values.person?.id ?? ''}
                onChange={(e) => {
                  done();
                  const id = Number(e.target.value);
                  void change({
                    person: personOptions.find((p) => p.id === id) ?? null,
                  });
                }}
                onBlur={done}
              >
                <option value="">Unassigned</option>
                {personOptions.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            )}
          </ClickToEdit>
        </Field>

        <Field label="Time frame">
          <ClickToEdit
            label="time frame"
            placeholder="Add time frame."
            readOnly={!editable}
            display={
              values.timeFrame ? formatTimeFrame(values.timeFrame) : null
            }
          >
            {(done) => (
              <DateEditor
                label="Time frame"
                value={values.timeFrame}
                onDone={done}
                onCommit={(picked) => {
                  // Any day picks its week; the Monday is what is saved
                  const monday = weekStart(picked);
                  if (monday !== values.timeFrame)
                    void change({ timeFrame: monday });
                }}
              />
            )}
          </ClickToEdit>
        </Field>

        <Field label="Due by">
          <ClickToEdit
            label="due by"
            placeholder="Add due by."
            readOnly={!editable}
            display={values.dueBy ? formatDueBy(values.dueBy) : null}
          >
            {(done) => (
              <DateEditor
                label="Due by"
                value={values.dueBy}
                onDone={done}
                onCommit={(picked) => {
                  if (picked !== values.dueBy) void change({ dueBy: picked });
                }}
              />
            )}
          </ClickToEdit>
        </Field>
      </dl>

      <div className="task-panel__tab-section">
        <div className="task-panel__tabs" role="tablist">
          {(['sub-tasks', 'attachments'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`task-panel__tab${
                tab === id ? ' task-panel__tab--active' : ''
              }`}
              onClick={() => setTab(id)}
            >
              {id === 'sub-tasks' ? 'Sub-tasks' : 'Attachments'}
            </button>
          ))}
        </div>

        {tab === 'sub-tasks' && (
          <>
            {canEdit && (
              <button
                type="button"
                className="task-panel__button"
                disabled
                title={SUB_TASKS_UNAVAILABLE}
              >
                Add Task +
              </button>
            )}

            {task?.subTasks?.length ? (
              <ul className="task-panel__references">
                {task.subTasks.map((subTask) => (
                  <li key={subTask.id} className="task-panel__reference">
                    <TaskReferenceRow reference={subTask} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="task-panel__empty">No sub-tasks yet.</p>
            )}
          </>
        )}

        {tab === 'attachments' && (
          <>
            {canEdit && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  aria-label="Attachment file"
                  onChange={handleFile}
                />
                <button
                  type="button"
                  className="task-panel__button"
                  disabled={!task}
                  title={
                    task
                      ? undefined
                      : 'Add a name, time frame and due by first.'
                  }
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add Attachment +
                </button>
              </>
            )}

            <ul className="task-panel__attachments">
              {task?.attachments.map((attachment) => (
                <li key={attachment.id} className="task-panel__attachment">
                  <img src={AttachmentIcon} alt="" />
                  <a href={attachment.fileUrl} target="_blank" rel="noreferrer">
                    {attachment.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {confirmingDelete && task && (
        <DeleteTaskModal
          task={task}
          deleting={deleting}
          error={deleteError}
          onCancel={() => {
            setConfirmingDelete(false);
            setDeleteError(null);
          }}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </aside>
  );
};

export default TaskSidePanel;
