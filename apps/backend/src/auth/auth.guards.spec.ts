import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './auth.guards';
import { ROLES_KEY } from './roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';

function makeContext(user: unknown): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = makeContext({ role: OmchaiRole.INFORMED });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when required roles list is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const context = makeContext({ role: OmchaiRole.INFORMED });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('denies access when user is not present on the request', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.OWNER]);
    const context = makeContext(null);
    expect(guard.canActivate(context)).toBe(false);
  });

  it('denies access when user has no role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.OWNER]);
    const context = makeContext({});
    expect(guard.canActivate(context)).toBe(false);
  });

  it('denies access when user role is not in required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([OmchaiRole.OWNER, OmchaiRole.MANAGER]);
    const context = makeContext({ role: OmchaiRole.INFORMED });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows access when user role matches one of the required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([
        OmchaiRole.OWNER,
        OmchaiRole.MANAGER,
        OmchaiRole.CONSULTED,
        OmchaiRole.HELPER,
      ]);
    const context = makeContext({ role: OmchaiRole.CONSULTED });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('uses ROLES_KEY when reading metadata', () => {
    const spy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(undefined);
    const context = makeContext({ role: OmchaiRole.OWNER });
    guard.canActivate(context);
    expect(spy).toHaveBeenCalledWith(
      ROLES_KEY,
      expect.arrayContaining([expect.any(Object), expect.any(Object)]),
    );
  });
});
