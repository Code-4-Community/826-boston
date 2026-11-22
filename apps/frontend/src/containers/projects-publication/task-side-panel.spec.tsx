import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import TaskSidePanel from './task-side-panel';
import { deferred, serverError } from './task-test-helpers';
import apiClient from '../../api/apiClient';
import {
  AreaOfWork,
  OmchaiEntry,
  OmchaiRole,
  Task,
  TaskStatus,
} from '../../types';

vi.mock('../../api/apiClient', () => ({
  default: {
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    uploadTaskAttachment: vi.fn(),
    getOmchaiByAnthology: vi.fn(),
  },
}));

const mockApi = apiClient as unknown as Record<
  string,
  ReturnType<typeof vi.fn>
>;

const task: Task = {
  id: 1,
  name: 'Book Project Planning Discussion',
  note: 'Before a Publishing Project can begin',
  areaOfWork: AreaOfWork.PLANNING,
  status: TaskStatus.NOT_STARTED,
  timeFrame: '2026-10-05',
  dueBy: '2026-10-10',
  personInCharge: { id: 2, firstName: 'Miranda', lastName: 'Burel' },
  attachments: [
    {
      id: 1,
      fileName: 'Planning_Discussion.pdf',
      fileUrl: 'https://files.example.com/planning.pdf',
    },
  ],
};

const member = (
  id: number,
  firstName: string,
  lastName: string,
): OmchaiEntry => ({
  id,
  anthologyId: 5,
  userId: id,
  role: OmchaiRole.HELPER,
  datetimeAssigned: '2026-01-01',
  user: { id, firstName, lastName },
});

// Lets a queued request, if there is one, start. Call it before asserting that
// nothing was sent: a save starts a moment after the edit, so checking at once
// would pass whatever the code does.
const flush = () => act(async () => undefined);

// Renders inside act so the people the panel fetches have loaded when it returns
async function setup(
  props: Partial<ComponentProps<typeof TaskSidePanel>> = {},
) {
  const onSaved = vi.fn();
  const onCreated = vi.fn();
  const onDeleted = vi.fn();
  const onClose = vi.fn();
  const onError = vi.fn();
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(
      <TaskSidePanel
        anthologyId={5}
        task={task}
        canEdit
        onClose={onClose}
        onSaved={onSaved}
        onCreated={onCreated}
        onDeleted={onDeleted}
        onError={onError}
        {...props}
      />,
    );
  });
  return {
    onSaved,
    onCreated,
    onDeleted,
    onClose,
    onError,
    unmount: view.unmount,
  };
}

// Type into a field and leave it, which is what saves it
function editField(label: string, value: string) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

function editDate(button: string, label: string, value: string) {
  fireEvent.click(screen.getByLabelText(button));
  editField(label, value);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.getOmchaiByAnthology.mockResolvedValue([
    member(2, 'Miranda', 'Burel'),
    member(3, 'Alice', 'Johnson'),
  ]);
  mockApi.updateTask.mockImplementation(
    async (_anthologyId: number, _taskId: number, body: object) => ({
      ...task,
      ...body,
    }),
  );
});

describe('TaskSidePanel', () => {
  it('shows the task with its attachments linked', async () => {
    await setup();

    expect((screen.getByLabelText('Task name') as HTMLInputElement).value).toBe(
      'Book Project Planning Discussion',
    );
    expect((screen.getByLabelText('Note') as HTMLTextAreaElement).value).toBe(
      'Before a Publishing Project can begin',
    );
    expect(screen.getByText('Not Started')).toBeTruthy();
    expect(screen.getByText('Planning')).toBeTruthy();
    expect(screen.getByText('Miranda Burel')).toBeTruthy();
    expect(screen.getByText('Week of 10/05')).toBeTruthy();
    expect(screen.getByText('10/10/2026')).toBeTruthy();

    const link = screen.getByText('Planning_Discussion.pdf');
    expect(link.getAttribute('href')).toBe(
      'https://files.example.com/planning.pdf',
    );
  });

  it('closes from the >> button', async () => {
    const { onClose } = await setup();
    fireEvent.click(screen.getByLabelText('Close task details'));
    expect(onClose).toHaveBeenCalled();
  });

  it('saves an edited field when it loses focus, with no Save button', async () => {
    const { onSaved } = await setup();

    editField('Task name', 'Renamed task');

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, {
      name: 'Renamed task',
    });
    expect(onSaved.mock.calls[0][0].name).toBe('Renamed task');
    expect(screen.queryByText(/^save$/i)).toBeNull();
  });

  it('does not save a field that did not change', async () => {
    await setup();
    editField('Note', 'Before a Publishing Project can begin');
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
  });

  it('puts the name back instead of saving an empty one', async () => {
    await setup();
    editField('Task name', '   ');
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
    expect((screen.getByLabelText('Task name') as HTMLInputElement).value).toBe(
      'Book Project Planning Discussion',
    );
  });

  it('changes the status from Not Started to Complete', async () => {
    await setup();

    fireEvent.click(screen.getByRole('button', { name: 'Not Started' }));
    expect(screen.getByRole('button', { name: 'In Progress' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, {
        status: TaskStatus.COMPLETE,
      }),
    );
  });

  it('lists only the OMCHAI members as people in charge', async () => {
    await setup();

    fireEvent.click(screen.getByLabelText('Edit person in charge'));
    await screen.findByRole('option', { name: 'Alice Johnson' });

    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Unassigned', 'Miranda Burel', 'Alice Johnson']);
    expect(mockApi.getOmchaiByAnthology).toHaveBeenCalledWith(5);

    fireEvent.change(screen.getByLabelText('Person in charge'), {
      target: { value: '3' },
    });
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, {
        personInChargeId: 3,
      }),
    );
  });

  it('still shows someone taken off the OMCHAI until the task is reassigned', async () => {
    await setup({
      task: {
        ...task,
        personInCharge: { id: 9, firstName: 'Old', lastName: 'Member' },
      },
    });

    expect(screen.getByText('Old Member')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Edit person in charge'));
    await screen.findByRole('option', { name: 'Alice Johnson' });
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Unassigned', 'Old Member', 'Miranda Burel', 'Alice Johnson']);
  });

  it('saves the Monday of the week picked as the time frame', async () => {
    await setup();

    // Wednesday 9/30 is in the week of Monday 9/28
    editDate('Edit time frame', 'Time frame', '2026-09-30');

    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, {
        timeFrame: '2026-09-28',
      }),
    );
  });

  it('does not save when the picked day is in the week already set', async () => {
    await setup();
    editDate('Edit time frame', 'Time frame', '2026-10-09');
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
  });

  it('rejects a due date before the time frame', async () => {
    await setup();

    editDate('Edit due by', 'Due by', '2026-10-01');

    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe(
      'Due by cannot be before the time frame.',
    );
  });

  it('rejects a time frame that starts after the due date', async () => {
    await setup();

    editDate('Edit time frame', 'Time frame', '2026-10-19');

    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('shows the error when the server refuses a change', async () => {
    mockApi.updateTask.mockRejectedValue(
      serverError(['Due date cannot be before the time frame']),
    );
    await setup();

    editField('Task name', 'Renamed task');

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Due date cannot be before the time frame',
    );
  });

  it('uploads an attachment', async () => {
    const withFile = { ...task, attachments: [] };
    mockApi.uploadTaskAttachment.mockResolvedValue(withFile);
    const { onSaved } = await setup();
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(screen.getByLabelText('Attachment file'), {
      target: { files: [file] },
    });

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(withFile));
    expect(mockApi.uploadTaskAttachment).toHaveBeenCalledWith(5, 1, file);
  });
});

describe('TaskSidePanel creating a task', () => {
  const created: Task = { ...task, id: 7, name: 'Cover design' };

  it('starts empty, with placeholders and what is still missing', async () => {
    await setup({ task: null });

    expect((screen.getByLabelText('Task name') as HTMLInputElement).value).toBe(
      '',
    );
    expect(screen.getByLabelText('Task name').getAttribute('placeholder')).toBe(
      'New Task',
    );
    expect(screen.getByText('Add area of work.')).toBeTruthy();
    expect(screen.getByText('Add staff member.')).toBeTruthy();
    expect(screen.getByText('Add time frame.')).toBeTruthy();
    expect(screen.getByText('Add due by.')).toBeTruthy();
    expect(
      screen.getByText(
        'Still needed to create this task: name, time frame, due by.',
      ),
    ).toBeTruthy();
    expect(screen.queryByLabelText('Delete task')).toBeNull();
    expect(
      (screen.getByText('Add Attachment +') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('creates the task once it has a name, time frame and due date', async () => {
    mockApi.createTask.mockResolvedValue(created);
    const { onCreated, onSaved } = await setup({ task: null });

    editField('Task name', 'Cover design');
    expect(
      screen.getByText('Still needed to create this task: time frame, due by.'),
    ).toBeTruthy();

    editDate('Edit time frame', 'Time frame', '2026-10-07');
    expect(
      screen.getByText('Still needed to create this task: due by.'),
    ).toBeTruthy();
    await flush();
    expect(mockApi.createTask).not.toHaveBeenCalled();

    editDate('Edit due by', 'Due by', '2026-10-10');

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(created));
    expect(mockApi.createTask).toHaveBeenCalledWith(5, {
      name: 'Cover design',
      timeFrame: '2026-10-05',
      dueBy: '2026-10-10',
      status: TaskStatus.NOT_STARTED,
    });
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
    // A new task is announced as created, never as an edit of an existing one
    await flush();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('sends the other fields filled in before it was created', async () => {
    mockApi.createTask.mockResolvedValue(created);
    await setup({ task: null });

    fireEvent.click(screen.getByLabelText('Edit area of work'));
    fireEvent.change(screen.getByLabelText('Area of work'), {
      target: { value: AreaOfWork.PRODUCTION },
    });
    fireEvent.click(screen.getByLabelText('Edit person in charge'));
    await screen.findByRole('option', { name: 'Alice Johnson' });
    fireEvent.change(screen.getByLabelText('Person in charge'), {
      target: { value: '3' },
    });
    editField('Task name', 'Cover design');
    editDate('Edit time frame', 'Time frame', '2026-10-05');
    editDate('Edit due by', 'Due by', '2026-10-10');

    await waitFor(() => expect(mockApi.createTask).toHaveBeenCalled());
    expect(mockApi.createTask).toHaveBeenCalledWith(5, {
      name: 'Cover design',
      timeFrame: '2026-10-05',
      dueBy: '2026-10-10',
      status: TaskStatus.NOT_STARTED,
      areaOfWork: AreaOfWork.PRODUCTION,
      personInChargeId: 3,
    });
  });

  it('does not create a task whose due date is before its time frame', async () => {
    await setup({ task: null });

    editField('Task name', 'Cover design');
    editDate('Edit time frame', 'Time frame', '2026-10-12');
    editDate('Edit due by', 'Due by', '2026-10-10');

    await flush();
    expect(mockApi.createTask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe(
      'Due by cannot be before the time frame.',
    );
  });
});

describe('TaskSidePanel deleting a task', () => {
  it('asks for confirmation with a summary, and Cancel keeps the task', async () => {
    const { onDeleted } = await setup();

    fireEvent.click(screen.getByLabelText('Delete task'));

    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain('Confirm deletion');
    expect(dialog.textContent).toContain(
      'Are you sure you want to delete this task? This action cannot be undone.',
    );
    expect(dialog.textContent).toContain('Book Project Planning Discussion');
    expect(dialog.textContent).toContain('Miranda Burel');
    expect(dialog.textContent).toContain('Week of 10/05');
    expect(dialog.textContent).toContain('10/10/2026');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    await flush();
    expect(mockApi.deleteTask).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('deletes the task when confirmed', async () => {
    mockApi.deleteTask.mockResolvedValue(undefined);
    const { onDeleted } = await setup();

    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith(1));
    expect(mockApi.deleteTask).toHaveBeenCalledWith(5, 1);
  });

  it('keeps the task and says why when the delete fails', async () => {
    mockApi.deleteTask.mockRejectedValue(serverError('Task not found'));
    const { onDeleted } = await setup();

    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Task not found',
    );
    expect(onDeleted).not.toHaveBeenCalled();
  });
});

describe('TaskSidePanel without edit rights', () => {
  it('shows the task but none of the controls that change it', async () => {
    await setup({ canEdit: false });

    expect(screen.getByText('Miranda Burel')).toBeTruthy();
    expect(screen.getByText('Planning_Discussion.pdf')).toBeTruthy();

    expect(screen.queryByLabelText('Delete task')).toBeNull();
    expect(screen.queryByText('Add Attachment +')).toBeNull();
    expect(screen.queryByLabelText('Edit area of work')).toBeNull();
    expect(screen.queryByLabelText('Edit person in charge')).toBeNull();
    expect(screen.queryByLabelText('Edit time frame')).toBeNull();
    expect(screen.queryByLabelText('Edit due by')).toBeNull();
    expect(screen.queryByTitle('Change status')).toBeNull();
    expect(
      (screen.getByLabelText('Task name') as HTMLInputElement).readOnly,
    ).toBe(true);
    expect(
      (screen.getByLabelText('Note') as HTMLTextAreaElement).readOnly,
    ).toBe(true);
    expect(mockApi.getOmchaiByAnthology).not.toHaveBeenCalled();
  });

  it('does not save anything when a read-only field is edited', async () => {
    await setup({ canEdit: false });
    editField('Task name', 'Renamed task');
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
  });
});

// The API has no parent or sub-task data yet, so these are a visual shell
describe('TaskSidePanel sub-tasks', () => {
  const tab = (name: string) => screen.getByRole('tab', { name });

  it('has Sub-tasks and Attachments tabs, landing on Attachments when there are no sub-tasks', async () => {
    await setup();

    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      'Sub-tasks',
      'Attachments',
    ]);
    expect(tab('Attachments').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Add Attachment +')).toBeTruthy();
  });

  it('shows an empty state and a disabled Add Task + on the Sub-tasks tab', async () => {
    await setup();

    fireEvent.click(tab('Sub-tasks'));

    expect(tab('Sub-tasks').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('No sub-tasks yet.')).toBeTruthy();
    expect((screen.getByText('Add Task +') as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(screen.queryByText('Add Attachment +')).toBeNull();

    fireEvent.click(tab('Attachments'));
    expect(screen.getByText('Add Attachment +')).toBeTruthy();
    expect(screen.queryByText('Add Task +')).toBeNull();
  });

  it('shows the Parent row empty, as a placeholder that cannot be used yet', async () => {
    await setup();

    const placeholder = screen.getByText('Add a parent task.');
    expect(placeholder.getAttribute('title')).toBe(
      "Sub-tasks aren't available yet.",
    );
    expect(screen.queryByLabelText('Edit parent')).toBeNull();
  });

  it('shows someone without edit rights no Add Task + and a dash for the parent', async () => {
    await setup({ canEdit: false });

    fireEvent.click(tab('Sub-tasks'));

    expect(screen.queryByText('Add Task +')).toBeNull();
    expect(screen.getByText('No sub-tasks yet.')).toBeTruthy();
    expect(screen.queryByText('Add a parent task.')).toBeNull();
    expect(screen.getByText('Parent').nextElementSibling?.textContent).toBe(
      '—',
    );
  });

  it('shows the parent and sub-tasks, landing on the Sub-tasks tab, once the API provides them', async () => {
    await setup({
      task: {
        ...task,
        parentTask: {
          id: 10,
          name: 'Author Approval / Submission',
          status: TaskStatus.IN_PROGRESS,
        },
        subTasks: [
          {
            id: 11,
            name: 'All Release Forms collected',
            status: TaskStatus.IN_PROGRESS,
          },
          {
            id: 12,
            name: 'Update publication tracker with final drafts',
            status: TaskStatus.COMPLETE,
          },
          {
            id: 13,
            name: 'Book Project Planning Discussion',
            status: TaskStatus.NOT_STARTED,
          },
        ],
      },
    });

    expect(tab('Sub-tasks').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Author Approval / Submission')).toBeTruthy();
    expect(screen.queryByText('Add a parent task.')).toBeNull();
    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual([
      'All Release Forms collected',
      'Update publication tracker with final drafts',
      'Book Project Planning Discussion',
    ]);
    expect(screen.queryByText('No sub-tasks yet.')).toBeNull();
  });
});

describe('TaskSidePanel saving', () => {
  const created: Task = { ...task, id: 7, name: 'Cover design' };

  // Fills in the three required fields of a new task, which starts the create
  function fillRequired() {
    editField('Task name', 'Cover design');
    editDate('Edit time frame', 'Time frame', '2026-10-07');
    editDate('Edit due by', 'Due by', '2026-10-10');
  }

  it('keeps every control live while a save is in flight', async () => {
    const save = deferred<Task>();
    mockApi.updateTask.mockReturnValue(save.promise);
    await setup();

    editField('Task name', 'Renamed task');

    expect(screen.getByText('Saving…')).toBeTruthy();
    // Not swapped for read-only text, so a click or keystroke arriving now lands
    expect(screen.getByLabelText('Edit due by').tagName).toBe('BUTTON');
    expect(screen.getByTitle('Change status').tagName).toBe('BUTTON');
    expect(
      (screen.getByLabelText('Note') as HTMLTextAreaElement).readOnly,
    ).toBe(false);

    await act(async () => {
      save.resolve({ ...task, name: 'Renamed task' });
    });
    expect(screen.queryByText('Saving…')).toBeNull();
  });

  it('sends saves one after another, in the order they were made', async () => {
    const first = deferred<Task>();
    const second = deferred<Task>();
    mockApi.updateTask
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { onSaved } = await setup();

    editField('Task name', 'Renamed task');
    editField('Note', 'A new note');
    // The first save is under way, the second waits behind it
    await act(async () => undefined);
    expect(mockApi.updateTask).toHaveBeenCalledTimes(1);

    await act(async () => {
      first.resolve({ ...task, name: 'Renamed task' });
    });
    await waitFor(() => expect(mockApi.updateTask).toHaveBeenCalledTimes(2));
    expect(mockApi.updateTask.mock.calls.map((call) => call[2])).toEqual([
      { name: 'Renamed task' },
      { note: 'A new note' },
    ]);

    await act(async () => {
      second.resolve({ ...task, name: 'Renamed task', note: 'A new note' });
    });
    expect(onSaved.mock.calls.map((call) => call[0].note)).toEqual([
      task.note,
      'A new note',
    ]);
  });

  it('reports a save that fails after the panel was closed', async () => {
    const save = deferred<Task>();
    mockApi.updateTask.mockReturnValue(save.promise);
    const { unmount, onError } = await setup();

    editField('Task name', 'Renamed task');
    await act(async () => undefined); // the request is on its way
    unmount();
    await act(async () => {
      save.reject(serverError('Task not found'));
    });

    await waitFor(() => expect(onError).toHaveBeenCalledWith('Task not found'));
  });

  it('waits for a save in flight before deleting', async () => {
    const save = deferred<Task>();
    mockApi.updateTask.mockReturnValue(save.promise);
    mockApi.deleteTask.mockResolvedValue(undefined);
    const { onDeleted } = await setup();

    editField('Task name', 'Renamed task');
    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await act(async () => undefined);
    expect(mockApi.deleteTask).not.toHaveBeenCalled();

    await act(async () => {
      save.resolve({ ...task, name: 'Renamed task' });
    });
    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith(1));
    expect(mockApi.deleteTask).toHaveBeenCalledWith(5, 1);
  });

  it('locks the fields while the new task is created, and creates it once', async () => {
    const create = deferred<Task>();
    mockApi.createTask.mockReturnValue(create.promise);
    const { onCreated } = await setup({ task: null });

    fillRequired();
    await act(async () => undefined); // the create is on its way
    expect(mockApi.createTask).toHaveBeenCalledTimes(1);
    expect(
      (screen.getByLabelText('Task name') as HTMLInputElement).readOnly,
    ).toBe(true);

    // Anything entered meanwhile is ignored, never a second create
    editField('Note', 'Too late');
    expect(mockApi.createTask).toHaveBeenCalledTimes(1);

    await act(async () => {
      create.resolve(created);
    });
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onCreated).toHaveBeenCalledWith(created);
  });

  it('creates only once even if the last field is committed twice in one go', async () => {
    mockApi.createTask.mockResolvedValue(created);
    const { onCreated } = await setup({ task: null });
    editField('Task name', 'Cover design');
    editDate('Edit time frame', 'Time frame', '2026-10-07');
    fireEvent.click(screen.getByLabelText('Edit due by'));
    const due = screen.getByLabelText('Due by');
    fireEvent.change(due, { target: { value: '2026-10-10' } });

    // Two commits before React has re-rendered with the first one's result
    act(() => {
      fireEvent.blur(due);
      fireEvent.blur(due);
    });

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(mockApi.createTask).toHaveBeenCalledTimes(1);
  });

  it('explains a failed create, and creates on the next change', async () => {
    mockApi.createTask
      .mockRejectedValueOnce(serverError('Something broke'))
      .mockResolvedValueOnce(created);
    const { onCreated } = await setup({ task: null });

    fillRequired();

    expect((await screen.findByRole('alert')).textContent).toBe(
      "Couldn't create the task (Something broke). Change any field to try again.",
    );
    expect(onCreated).not.toHaveBeenCalled();

    editField('Note', 'Try again');
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(created));
    expect(mockApi.createTask).toHaveBeenCalledTimes(2);
  });

  it('does not save a year that is only half typed', async () => {
    await setup();

    // A date input reports 0002 on the way to typing 2026
    editDate('Edit time frame', 'Time frame', '0002-10-05');

    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();
  });

  it('commits on Enter and puts the old value back on Escape', async () => {
    await setup();
    const title = screen.getByLabelText('Task name') as HTMLInputElement;

    act(() => title.focus());
    fireEvent.change(title, { target: { value: 'Discarded' } });
    fireEvent.keyDown(title, { key: 'Escape' });
    expect(title.value).toBe('Book Project Planning Discussion');
    await flush();
    expect(mockApi.updateTask).not.toHaveBeenCalled();

    act(() => title.focus());
    fireEvent.change(title, { target: { value: 'Kept' } });
    fireEvent.keyDown(title, { key: 'Enter' });
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, { name: 'Kept' }),
    );
  });

  it('trims what is saved', async () => {
    await setup();
    editField('Task name', '  Padded  ');
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenCalledWith(5, 1, {
        name: 'Padded',
      }),
    );
  });

  it('clears the note, area of work and person in charge by sending null', async () => {
    await setup();

    editField('Note', '');
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenLastCalledWith(5, 1, {
        note: null,
      }),
    );

    fireEvent.click(screen.getByLabelText('Edit area of work'));
    fireEvent.change(screen.getByLabelText('Area of work'), {
      target: { value: '' },
    });
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenLastCalledWith(5, 1, {
        areaOfWork: null,
      }),
    );

    fireEvent.click(screen.getByLabelText('Edit person in charge'));
    fireEvent.change(screen.getByLabelText('Person in charge'), {
      target: { value: '' },
    });
    await waitFor(() =>
      expect(mockApi.updateTask).toHaveBeenLastCalledWith(5, 1, {
        personInChargeId: null,
      }),
    );
  });

  it('does not overwrite a field being typed in when a save finishes', async () => {
    const props = {
      anthologyId: 5,
      canEdit: true,
      onClose: vi.fn(),
      onSaved: vi.fn(),
      onCreated: vi.fn(),
      onDeleted: vi.fn(),
      onError: vi.fn(),
    };
    const view = render(<TaskSidePanel {...props} task={task} />);
    await act(async () => undefined);
    const title = screen.getByLabelText('Task name') as HTMLInputElement;

    act(() => title.focus());
    fireEvent.change(title, { target: { value: 'Typing in progress' } });
    // A save for this task lands while the field is still being typed in
    view.rerender(
      <TaskSidePanel {...props} task={{ ...task, name: 'Saved' }} />,
    );

    expect(title.value).toBe('Typing in progress');
  });

  it("reads each field's value out as the description of its edit button", async () => {
    await setup();

    const button = screen.getByLabelText('Edit time frame');
    const described = document.getElementById(
      button.getAttribute('aria-describedby') as string,
    );
    expect(described?.textContent).toBe('Week of 10/05');
  });
});
