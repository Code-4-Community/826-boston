import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AreaOfWork, Task } from '../../types';
import {
  diffInDays,
  getToday,
  isOverdue,
  parseLocalDate,
} from '../../utils/task-dates';
import './tasks-timeline.css';

interface Props {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

// Width of one day column. Also set as --day-width so the CSS gridlines line up
export const DAY_WIDTH = 187;
const ROW_HEIGHT = 48;

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const TasksTimeline: React.FC<Props> = ({ tasks, onTaskClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = getToday();

  // The days shown: from the month before the earliest date through the month
  // after the latest one, always including today
  const { start, dayCount } = useMemo(() => {
    const todayDate = parseLocalDate(today);
    let first = todayDate;
    let last = todayDate;
    for (const task of tasks) {
      const taskStart = parseLocalDate(task.timeFrame);
      const taskEnd = parseLocalDate(task.dueBy);
      if (taskStart < first) first = taskStart;
      if (taskEnd > last) last = taskEnd;
    }
    const rangeStart = new Date(first.getFullYear(), first.getMonth() - 1, 1);
    const rangeEnd = new Date(last.getFullYear(), last.getMonth() + 2, 0);
    return {
      start: rangeStart,
      dayCount: diffInDays(rangeStart, rangeEnd) + 1,
    };
  }, [tasks, today]);

  const todayOffset = diffInDays(start, parseLocalDate(today));
  const clampOffset = (offset: number) =>
    Math.min(Math.max(offset, 0), dayCount - 1);

  // The day at the left edge of the view, which sets the month in the header
  const [visibleOffset, setVisibleOffset] = useState(todayOffset);
  const visibleDate = addDays(start, clampOffset(visibleOffset));

  const scrollToOffset = (offset: number) => {
    const target = clampOffset(offset);
    setVisibleOffset(target);
    const el = scrollRef.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ left: target * DAY_WIDTH });
    } else {
      el.scrollLeft = target * DAY_WIDTH;
    }
  };

  // Open scrolled to today
  useLayoutEffect(() => {
    scrollToOffset(todayOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) setVisibleOffset(Math.round(el.scrollLeft / DAY_WIDTH));
  };

  const goToMonth = (delta: number) => {
    const target = new Date(
      visibleDate.getFullYear(),
      visibleDate.getMonth() + delta,
      1,
    );
    scrollToOffset(diffInDays(start, target));
  };

  const firstMonth = start.getFullYear() * 12 + start.getMonth();
  const lastDate = addDays(start, dayCount - 1);
  const lastMonth = lastDate.getFullYear() * 12 + lastDate.getMonth();
  const visibleMonth = visibleDate.getFullYear() * 12 + visibleDate.getMonth();

  const days = Array.from({ length: dayCount }, (_, i) => addDays(start, i));
  const canvasWidth = dayCount * DAY_WIDTH;

  return (
    <div className="tasks-timeline">
      <div className="tasks-timeline-nav">
        <button
          type="button"
          className="tasks-timeline-arrow"
          aria-label="Previous month"
          disabled={visibleMonth <= firstMonth}
          onClick={() => goToMonth(-1)}
        >
          <span className="tasks-timeline-arrow-icon tasks-timeline-arrow-icon--prev" />
        </button>
        <h2 className="tasks-timeline-month">
          {visibleDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          type="button"
          className="tasks-timeline-arrow"
          aria-label="Next month"
          disabled={visibleMonth >= lastMonth}
          onClick={() => goToMonth(1)}
        >
          <span className="tasks-timeline-arrow-icon tasks-timeline-arrow-icon--next" />
        </button>
      </div>

      <div
        className="tasks-timeline-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ '--day-width': `${DAY_WIDTH}px` } as React.CSSProperties}
      >
        <div className="tasks-timeline-canvas" style={{ width: canvasWidth }}>
          <div className="tasks-timeline-header">
            {days.map((day) => (
              <div key={day.getTime()} className="tasks-timeline-day">
                {day.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            ))}
          </div>

          <div
            className="tasks-timeline-body"
            style={{ minHeight: tasks.length * ROW_HEIGHT + 80 }}
          >
            <div
              className="tasks-timeline-today"
              data-testid="timeline-today-line"
              aria-hidden="true"
              style={{ left: (todayOffset + 0.5) * DAY_WIDTH }}
            />

            {tasks.map((task, row) => {
              const startOffset = diffInDays(
                start,
                parseLocalDate(task.timeFrame),
              );
              // The bar covers the whole due date, so it is at least one day
              const span = Math.max(
                1,
                diffInDays(
                  parseLocalDate(task.timeFrame),
                  parseLocalDate(task.dueBy),
                ) + 1,
              );
              const area = (
                task.areaOfWork ?? AreaOfWork.PLANNING
              ).toLowerCase();
              const overdue = isOverdue(task, today);

              return (
                <button
                  key={task.id}
                  type="button"
                  className={`tasks-bar tasks-bar--${area}${
                    overdue ? ' tasks-bar--overdue' : ''
                  }`}
                  title={task.name}
                  style={{
                    left: startOffset * DAY_WIDTH,
                    width: span * DAY_WIDTH,
                    top: 40 + row * ROW_HEIGHT,
                  }}
                  onClick={() => onTaskClick?.(task)}
                >
                  {task.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTimeline;
