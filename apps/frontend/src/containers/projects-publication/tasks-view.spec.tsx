import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TasksView from './tasks-view';
import { permissionsFor } from './permissions';
import { deferred, serverError } from './task-test-helpers';
import apiClient from '../../api/apiClient';
import { AreaOfWork, OmchaiRole, Task, TaskStatus } from '../../types';

vi.mock('../../api/apiClient', () => ({
  default: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getOmchaiByAnthology: vi.fn(),
  },
}));

const mockApi = apiClient as unknown as Record<
  string,
  ReturnType<typeof vi.fn>
>;

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 1,
  name: 'Task',
  areaOfWork: AreaOfWork.PLANNING,
  status: TaskStatus.NOT_STARTED,
  timeFrame: '2999-01-01',
  dueBy: '2999-01-01',
  personInCharge: { id: 1, firstName: 'Miranda', lastName: 'Burel' },
  attachments: [],
  ...overrides,
});

// Resolves once the tasks have loaded
async function setup(tasks: Task[], canEdit = false) {
  mockApi.getTasks.mockResolvedValue(tasks);
  render(<TasksView anthologyId={5} canEdit={canEdit} />);
  await waitFor(() => expect(screen.getByText('Filters')).toBeTruthy());
}

// Clicks run inside act so what the panel does on opening (it fetches the
// people on the publication) has settled when they return
const openRow = (name: string) =>
  act(async () => {
    fireEvent.click(screen.getByText(name));
  });
const openNew = () =>
  act(async () => {
    fireEvent.click(screen.getByLabelText('Add task'));
  });

// Fills in a new task's three required fields, which starts creating it
function fillRequired(name: string) {
  const title = screen.getByLabelText('Task name');
  fireEvent.change(title, { target: { value: name } });
  fireEvent.blur(title);
  fireEvent.click(screen.getByLabelText('Edit time frame'));
  const timeFrame = screen.getByLabelText('Time frame');
  fireEvent.change(timeFrame, { target: { value: '2026-10-05' } });
  fireEvent.blur(timeFrame);
  fireEvent.click(screen.getByLabelText('Edit due by'));
  const dueBy = screen.getByLabelText('Due by');
  fireEvent.change(dueBy, { target: { value: '2026-10-10' } });
  fireEvent.blur(dueBy);
}

describe('TasksView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.getOmchaiByAnthology.mockResolvedValue([]);
  });

  it('loads the tasks for the publication', async () => {
    await setup([]);
    expect(mockApi.getTasks).toHaveBeenCalledWith(5);
  });

  it('shows the task details', async () => {
    await setup([
      makeTask({
        name: 'Draft Check-Point',
        areaOfWork: AreaOfWork.CHECKPOINT,
        attachments: [{ id: 1, fileName: 'a.pdf', fileUrl: 'a.pdf' }],
      }),
    ]);

    expect(screen.getByText('Draft Check-Point')).toBeTruthy();
    expect(screen.getByText('Checkpoint')).toBeTruthy();
    expect(screen.getByText('Miranda Burel')).toBeTruthy();
    expect(screen.getByAltText('Has attachments')).toBeTruthy();
  });

  it('shows dates on the day they are stored, not the day before', async () => {
    await setup([makeTask({ timeFrame: '2026-10-05', dueBy: '2026-10-10' })]);

    expect(screen.getByText('Week of 10/05')).toBeTruthy();
    expect(screen.getByText('10/10/2026')).toBeTruthy();
  });

  it('lists open tasks by due date, then completed tasks', async () => {
    await setup([
      makeTask({
        id: 1,
        name: 'Done',
        status: TaskStatus.COMPLETE,
        dueBy: '2998-01-01',
      }),
      makeTask({ id: 2, name: 'Later', dueBy: '2999-06-01' }),
      makeTask({ id: 3, name: 'Sooner', dueBy: '2999-01-01' }),
    ]);

    const names = screen
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.querySelector('td')?.textContent);
    expect(names).toEqual(['Sooner', 'Later', 'Done']);
  });

  it('shows the due date in red only for open tasks past their due date', async () => {
    await setup([
      makeTask({ id: 1, dueBy: '2020-01-01' }),
      makeTask({ id: 2, dueBy: '2020-02-02', status: TaskStatus.COMPLETE }),
      makeTask({ id: 3, dueBy: '2999-03-03' }),
    ]);

    expect(screen.getByText('1/1/2020').className).toContain('overdue');
    expect(screen.getByText('2/2/2020').className).not.toContain('overdue');
    expect(screen.getByText('3/3/2999').className).not.toContain('overdue');
  });

  it('shows an empty state when there are no tasks', async () => {
    await setup([]);
    expect(screen.getByText('No tasks yet.')).toBeTruthy();
  });

  describe('task side panel', () => {
    it('opens with the details of the clicked task and closes with >>', async () => {
      await setup([
        makeTask({ id: 1, name: 'Draft Check-Point' }),
        makeTask({ id: 2, name: 'Drafts reviewed' }),
      ]);
      expect(screen.queryByLabelText('Task details')).toBeNull();

      await openRow('Drafts reviewed');

      expect(screen.getByLabelText('Task details')).toBeTruthy();
      expect(
        (screen.getByLabelText('Task name') as HTMLInputElement).value,
      ).toBe('Drafts reviewed');

      fireEvent.click(screen.getByLabelText('Close task details'));
      expect(screen.queryByLabelText('Task details')).toBeNull();
    });

    it('lets someone without edit rights open a task but not change it', async () => {
      await setup([makeTask({ name: 'Draft Check-Point' })]);

      expect(screen.queryByLabelText('Add task')).toBeNull();

      await openRow('Draft Check-Point');

      expect(screen.getByLabelText('Task details')).toBeTruthy();
      expect(screen.queryByLabelText('Delete task')).toBeNull();
      expect(screen.queryByText('Add Attachment +')).toBeNull();
    });

    it('shows the + only with edit rights, and it opens a new task', async () => {
      await setup([makeTask({ name: 'Draft Check-Point' })], true);

      await openNew();

      expect(screen.getByText('New Task')).toBeTruthy();
      expect(
        (screen.getByLabelText('Task name') as HTMLInputElement).value,
      ).toBe('');
      expect(screen.getByText(/Still needed to create this task/)).toBeTruthy();
    });

    it('adds a created task to the list and keeps its panel open', async () => {
      const created = makeTask({
        id: 9,
        name: 'Cover design',
        timeFrame: '2026-10-05',
        dueBy: '2026-10-10',
      });
      mockApi.createTask.mockResolvedValue(created);
      await setup([], true);

      await openNew();
      fillRequired('Cover design');

      await waitFor(() =>
        expect(screen.getAllByText('Cover design').length).toBeGreaterThan(0),
      );
      // The list row replaced the "New Task" placeholder row
      await waitFor(() => expect(screen.queryByText('New Task')).toBeNull());
      // Once in the list row and once in the panel
      expect(screen.getAllByText('Week of 10/05')).toHaveLength(2);
      expect(
        (screen.getByLabelText('Task name') as HTMLInputElement).value,
      ).toBe('Cover design');
      // Now that the task exists it can be deleted and given attachments
      expect(screen.getByLabelText('Delete task')).toBeTruthy();
    });

    it('updates the list as soon as a task is changed', async () => {
      mockApi.updateTask.mockResolvedValue(
        makeTask({
          id: 1,
          name: 'Draft Check-Point',
          status: TaskStatus.COMPLETE,
        }),
      );
      await setup([makeTask({ id: 1, name: 'Draft Check-Point' })], true);
      const row = () => screen.getByText('Draft Check-Point').closest('tr');
      expect(row()?.className).not.toContain('complete');

      await openRow('Draft Check-Point');
      fireEvent.click(screen.getByRole('button', { name: 'Not Started' }));
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      await waitFor(() => expect(row()?.className).toContain('complete'));
    });

    it('removes a deleted task from the list and closes the panel', async () => {
      mockApi.deleteTask.mockResolvedValue(undefined);
      await setup(
        [
          makeTask({ id: 1, name: 'Draft Check-Point' }),
          makeTask({ id: 2, name: 'Drafts reviewed' }),
        ],
        true,
      );

      await openRow('Draft Check-Point');
      fireEvent.click(screen.getByLabelText('Delete task'));
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() =>
        expect(screen.queryByText('Draft Check-Point')).toBeNull(),
      );
      expect(screen.getByText('Drafts reviewed')).toBeTruthy();
      expect(screen.queryByLabelText('Task details')).toBeNull();
      expect(mockApi.deleteTask).toHaveBeenCalledWith(5, 1);
    });

    it('shows a save that fails after its panel was closed, until another task is opened', async () => {
      const save = deferred<Task>();
      mockApi.updateTask.mockReturnValue(save.promise);
      await setup(
        [
          makeTask({ id: 1, name: 'Draft Check-Point' }),
          makeTask({ id: 2, name: 'Drafts reviewed' }),
        ],
        true,
      );
      await openRow('Draft Check-Point');
      const note = screen.getByLabelText('Note');
      fireEvent.change(note, { target: { value: 'A note' } });
      fireEvent.blur(note);
      await act(async () => undefined); // the save is on its way
      fireEvent.click(screen.getByLabelText('Close task details'));
      expect(screen.queryByLabelText('Task details')).toBeNull();

      await act(async () => {
        save.reject(serverError('Task not found'));
      });

      expect((await screen.findByRole('alert')).textContent).toBe(
        'Task not found',
      );

      await openRow('Drafts reviewed');
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('still adds a task whose create finishes after its panel was closed', async () => {
      const create = deferred<Task>();
      mockApi.createTask.mockReturnValue(create.promise);
      await setup([], true);
      await openNew();
      fillRequired('Closed early');
      await act(async () => undefined); // the create is on its way
      fireEvent.click(screen.getByLabelText('Close task details'));

      await act(async () => {
        create.resolve(
          makeTask({
            id: 9,
            name: 'Closed early',
            timeFrame: '2026-10-05',
            dueBy: '2026-10-10',
          }),
        );
      });

      expect(screen.getByText('Closed early')).toBeTruthy();
      // And the panel stays closed rather than reopening on its own
      expect(screen.queryByLabelText('Task details')).toBeNull();
    });

    it('does not let a create that finishes late take over a newer draft', async () => {
      const create = deferred<Task>();
      mockApi.createTask.mockReturnValue(create.promise);
      await setup([], true);
      await openNew();
      fillRequired('First draft');
      await act(async () => undefined);
      fireEvent.click(screen.getByLabelText('Close task details'));
      await openNew(); // a second, empty draft

      await act(async () => {
        create.resolve(
          makeTask({
            id: 9,
            name: 'First draft',
            timeFrame: '2026-10-05',
            dueBy: '2026-10-10',
          }),
        );
      });

      // The first draft is in the list; the open panel is still the empty one
      expect(screen.getAllByText('First draft')).toHaveLength(1);
      expect(
        (screen.getByLabelText('Task name') as HTMLInputElement).value,
      ).toBe('');
      expect(screen.getByText(/Still needed to create this task/)).toBeTruthy();
    });
  });

  it.each([
    [OmchaiRole.OWNER, true],
    [OmchaiRole.MANAGER, true],
    [OmchaiRole.HELPER, false],
    [OmchaiRole.APPROVER, false],
    [OmchaiRole.CONSULTED, false],
    [OmchaiRole.INFORMED, false],
  ])('%s: the + is shown only to an Owner or Manager', async (role, shown) => {
    await setup([makeTask({})], permissionsFor(role, false).canEditTasks);
    expect(screen.queryByLabelText('Add task') !== null).toBe(shown);
  });
});
