import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TasksTimeline, { DAY_WIDTH } from './tasks-timeline';
import { AreaOfWork, Task, TaskStatus } from '../../types';

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 1,
  name: 'Task',
  areaOfWork: AreaOfWork.PLANNING,
  status: TaskStatus.NOT_STARTED,
  timeFrame: '2025-10-05',
  dueBy: '2025-10-10',
  personInCharge: null,
  attachments: [],
  ...overrides,
});

// With "today" set to 2025-10-07 and a task starting 2025-10-05, the timeline
// starts on 2025-09-01 (the month before the earliest date) and ends on
// 2025-11-30 (the month after the latest one).
const OCT_5_OFFSET = 34;
const OCT_7_OFFSET = 36;

const scrollTo = vi.fn();

describe('TasksTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2025, 9, 7, 12));
    HTMLElement.prototype.scrollTo = scrollTo;
    scrollTo.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts a bar on its time frame and ends it on its due date', () => {
    render(<TasksTimeline tasks={[makeTask({ name: 'Planning chat' })]} />);

    const bar = screen.getByRole('button', { name: 'Planning chat' });
    expect(bar.style.left).toBe(`${OCT_5_OFFSET * DAY_WIDTH}px`);
    // October 5 through October 10, counting the due date itself
    expect(bar.style.width).toBe(`${6 * DAY_WIDTH}px`);
  });

  it('gives a task due on its time frame a one day bar', () => {
    render(
      <TasksTimeline
        tasks={[makeTask({ name: 'Quick', dueBy: '2025-10-05' })]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Quick' }).style.width).toBe(
      `${DAY_WIDTH}px`,
    );
  });

  it('colors bars by area of work', () => {
    render(
      <TasksTimeline
        tasks={[
          makeTask({ id: 1, name: 'A', areaOfWork: AreaOfWork.PLANNING }),
          makeTask({ id: 2, name: 'B', areaOfWork: AreaOfWork.PROGRAMMING }),
          makeTask({ id: 3, name: 'C', areaOfWork: AreaOfWork.PRODUCTION }),
          makeTask({ id: 4, name: 'D', areaOfWork: AreaOfWork.CHECKPOINT }),
          makeTask({ id: 5, name: 'E', areaOfWork: null }),
        ]}
      />,
    );

    expect(screen.getByText('A').className).toContain('tasks-bar--planning');
    expect(screen.getByText('B').className).toContain('tasks-bar--programming');
    expect(screen.getByText('C').className).toContain('tasks-bar--production');
    expect(screen.getByText('D').className).toContain('tasks-bar--checkpoint');
    // No area of work falls back to the grey Planning color
    expect(screen.getByText('E').className).toContain('tasks-bar--planning');
  });

  it('marks open tasks past their due date as overdue, and only those', () => {
    render(
      <TasksTimeline
        tasks={[
          makeTask({ id: 1, name: 'Late', dueBy: '2025-10-06' }),
          makeTask({
            id: 2,
            name: 'Late but done',
            dueBy: '2025-10-06',
            status: TaskStatus.COMPLETE,
          }),
          makeTask({ id: 3, name: 'Due today', dueBy: '2025-10-07' }),
        ]}
      />,
    );

    expect(screen.getByText('Late').className).toContain('overdue');
    expect(screen.getByText('Late but done').className).not.toContain(
      'overdue',
    );
    expect(screen.getByText('Due today').className).not.toContain('overdue');
  });

  it('draws the today line in the middle of today', () => {
    render(<TasksTimeline tasks={[makeTask({})]} />);

    expect(screen.getByTestId('timeline-today-line').style.left).toBe(
      `${(OCT_7_OFFSET + 0.5) * DAY_WIDTH}px`,
    );
  });

  it('opens scrolled to today, showing the current month', () => {
    render(<TasksTimeline tasks={[makeTask({})]} />);

    expect(scrollTo).toHaveBeenCalledWith({ left: OCT_7_OFFSET * DAY_WIDTH });
    expect(screen.getByText('October 2025')).toBeTruthy();
  });

  it('labels each day', () => {
    render(<TasksTimeline tasks={[makeTask({})]} />);

    expect(screen.getByText('October 5')).toBeTruthy();
    expect(screen.getByText('October 6')).toBeTruthy();
  });

  it('moves a month at a time with the arrows', () => {
    render(<TasksTimeline tasks={[makeTask({})]} />);

    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('November 2025')).toBeTruthy();
    // November 1 is 61 days after September 1
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 61 * DAY_WIDTH });

    fireEvent.click(screen.getByLabelText('Previous month'));
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('September 2025')).toBeTruthy();
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
  });

  it('stops the arrows at the ends of the timeline', () => {
    render(<TasksTimeline tasks={[makeTask({})]} />);

    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(
      (screen.getByLabelText('Previous month') as HTMLButtonElement).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByLabelText('Next month'));
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(
      (screen.getByLabelText('Next month') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('calls onTaskClick with the task that was clicked', () => {
    const onTaskClick = vi.fn();
    const task = makeTask({ name: 'Open me' });
    render(<TasksTimeline tasks={[task]} onTaskClick={onTaskClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open me' }));
    expect(onTaskClick).toHaveBeenCalledWith(task);
  });

  it('shows the new dates when the tasks change', () => {
    const { rerender } = render(
      <TasksTimeline tasks={[makeTask({ name: 'Moving' })]} />,
    );
    rerender(
      <TasksTimeline
        tasks={[makeTask({ name: 'Moving', timeFrame: '2025-10-06' })]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Moving' }).style.left).toBe(
      `${(OCT_5_OFFSET + 1) * DAY_WIDTH}px`,
    );
  });
});
