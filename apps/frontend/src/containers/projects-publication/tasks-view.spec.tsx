import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TasksView from './tasks-view';
import apiClient from '../../api/apiClient';
import { AreaOfWork, Task, TaskStatus } from '../../types';

vi.mock('../../api/apiClient', () => ({
  default: {
    getTasks: vi.fn(),
  },
}));

const mockApi = apiClient as unknown as {
  getTasks: ReturnType<typeof vi.fn>;
};

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
async function setup(tasks: Task[]) {
  mockApi.getTasks.mockResolvedValue(tasks);
  render(<TasksView anthologyId={5} />);
  await waitFor(() => expect(screen.getByText('Filters')).toBeTruthy());
}

describe('TasksView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
