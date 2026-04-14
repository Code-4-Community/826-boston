import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserStatusGuard } from './user-status.guard';
import { USER_STATUS } from '../roles.decorator';
import { Role } from '../../users/types';

function makeContext(user: unknown): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

const adminUser = { id: 1, email: 'admin@example.com', role: Role.ADMIN };
const volunteerUser = {
  id: 2,
  email: 'vol@example.com',
  role: Role.STANDARD,
};

describe('UserStatusGuard', () => {
  let reflector: Reflector;
  let guard: UserStatusGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserStatusGuard(reflector);
  });

  it('allows access when no statuses are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(makeContext(adminUser))).toBe(true);
  });

  it('allows access when required statuses list is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    expect(guard.canActivate(makeContext(adminUser))).toBe(true);
  });

  it('allows access when user has the required status', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(makeContext(adminUser))).toBe(true);
  });

  it('denies access when user does not have the required status', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(makeContext(volunteerUser))).toBe(false);
  });

  it('denies access when there is no user on the request', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(makeContext(undefined))).toBe(false);
  });

  it('uses USER_STATUS when reading metadata', () => {
    const spy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(undefined);
    guard.canActivate(makeContext(adminUser));
    expect(spy).toHaveBeenCalledWith(
      USER_STATUS,
      expect.arrayContaining([expect.any(Object), expect.any(Object)]),
    );
  });
});
