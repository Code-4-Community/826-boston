import { ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OmchaiGuard } from './omchai.guard';
import { OMCHAI_ROLES } from '../roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { User } from 'src/users/user.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { Role } from 'src/users/types';

function makeContext(
  user: unknown,
  params: Record<string, string> = {},
): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user, params }),
    }),
  } as unknown as ExecutionContext;
}

const standardUser: User = {
  id: 1,
  email: 'test@example.com',
  omchaiAssignments: [
    {
      anthology: { id: 42 } as Anthology,
      role: OmchaiRole.MANAGER,
      id: 0,
      datetimeAssigned: new Date(),
      user: new User(),
    },
    {
      anthology: { id: 99 } as Anthology,
      role: OmchaiRole.HELPER,
      id: 0,
      datetimeAssigned: new Date(),
      user: new User(),
    },
  ],
  role: Role.STANDARD,
  firstName: '',
  lastName: '',
};

const noAssignmentsUser: User = {
  id: 1,
  email: 'test@example.com',
  omchaiAssignments: [],
  role: Role.ADMIN,
  firstName: '',
  lastName: '',
};

const insufficientRoleUser: User = {
  id: 1,
  email: 'test@example.com',
  omchaiAssignments: [
    {
      anthology: { id: 42 } as Anthology,
      role: OmchaiRole.HELPER,
      id: 0,
      datetimeAssigned: new Date(),
      user: new User(),
    },
    {
      anthology: { id: 99 } as Anthology,
      role: OmchaiRole.APPROVER,
      id: 0,
      datetimeAssigned: new Date(),
      user: new User(),
    },
  ],
  role: Role.ADMIN,
  firstName: '',
  lastName: '',
};

describe('OmchaiGuard', () => {
  let reflector: Reflector;
  let guard: OmchaiGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new OmchaiGuard(reflector);
  });

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = makeContext(standardUser, { id: '42' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when required roles list is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const context = makeContext(standardUser, { id: '42' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('denies access when user has no omchai assignments', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.MANAGER]);
    const context = makeContext(noAssignmentsUser, { id: '42' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('denies access and logs a warning when anthology ID is missing from params', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.MANAGER]);
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const context = makeContext(noAssignmentsUser, {});

    expect(guard.canActivate(context)).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('no anthology ID found in params'),
    );
  });

  it('allows access when user has the required role for the anthology', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.OWNER, OmchaiRole.MANAGER]);
    const context = makeContext(standardUser, { id: '42' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('denies access when user has an assignment for the anthology but with insufficient role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.OWNER, OmchaiRole.MANAGER]);
    const context = makeContext(insufficientRoleUser, { id: '99' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('denies access when user has no assignment for the requested anthology', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.MANAGER]);
    const context = makeContext(insufficientRoleUser, { id: '7' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('resolves anthology ID from anthologyId param when id is absent', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.MANAGER]);
    const context = makeContext(standardUser, { anthologyId: '42' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('uses OMCHAI_ROLES when reading metadata', () => {
    const spy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(undefined);
    const context = makeContext(standardUser, { id: '42' });
    guard.canActivate(context);
    expect(spy).toHaveBeenCalledWith(
      OMCHAI_ROLES,
      expect.arrayContaining([expect.any(Object), expect.any(Object)]),
    );
  });
});
