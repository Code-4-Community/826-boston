import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

// The same checks the app's ValidationPipe runs on a request body
async function invalidFields(
  type: new () => object,
  body: Record<string, unknown>,
): Promise<string[]> {
  const errors = await validate(plainToInstance(type, body), {
    whitelist: true,
  });
  return errors.map((e) => e.property).sort();
}

describe('CreateTaskDto', () => {
  const valid = {
    name: 'Draft Check-Point',
    timeFrame: '2026-10-05',
    dueBy: '2026-10-10',
  };

  it('accepts a name, time frame and due date', async () => {
    expect(await invalidFields(CreateTaskDto, valid)).toEqual([]);
  });

  it('requires a time frame', async () => {
    const { timeFrame, ...body } = valid;
    expect(timeFrame).toBeDefined();
    expect(await invalidFields(CreateTaskDto, body)).toEqual(['timeFrame']);
  });

  it('requires a due date', async () => {
    const { dueBy, ...body } = valid;
    expect(dueBy).toBeDefined();
    expect(await invalidFields(CreateTaskDto, body)).toEqual(['dueBy']);
  });

  it('rejects null and malformed dates', async () => {
    expect(
      await invalidFields(CreateTaskDto, {
        ...valid,
        timeFrame: null,
        dueBy: 'next week',
      }),
    ).toEqual(['dueBy', 'timeFrame']);
  });

  it('lets the optional fields be left out', async () => {
    expect(
      await invalidFields(CreateTaskDto, {
        ...valid,
        note: 'A note',
        areaOfWork: 'PLANNING',
        personInChargeId: 3,
      }),
    ).toEqual([]);
  });
});

describe('UpdateTaskDto', () => {
  it('accepts a partial update', async () => {
    expect(await invalidFields(UpdateTaskDto, {})).toEqual([]);
    expect(await invalidFields(UpdateTaskDto, { status: 'COMPLETE' })).toEqual(
      [],
    );
  });

  it('does not let the required dates be cleared', async () => {
    expect(
      await invalidFields(UpdateTaskDto, { timeFrame: null, dueBy: null }),
    ).toEqual(['dueBy', 'timeFrame']);
  });

  it('does not let the name or status be cleared', async () => {
    expect(
      await invalidFields(UpdateTaskDto, { name: null, status: null }),
    ).toEqual(['name', 'status']);
  });

  it('lets the note, area of work and person in charge be cleared', async () => {
    expect(
      await invalidFields(UpdateTaskDto, {
        note: null,
        areaOfWork: null,
        personInChargeId: null,
      }),
    ).toEqual([]);
  });
});
