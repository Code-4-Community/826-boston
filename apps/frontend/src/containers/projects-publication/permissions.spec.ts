import { describe, expect, it } from 'vitest';
import { OmchaiRole } from '../../types';
import { permissionsFor } from './permissions';

describe('permissionsFor', () => {
  it.each([
    [OmchaiRole.OWNER, [true, true, true, true]],
    [OmchaiRole.MANAGER, [true, true, true, true]],
    [OmchaiRole.HELPER, [true, false, false, false]],
    [OmchaiRole.APPROVER, [false, true, true, false]],
    [OmchaiRole.CONSULTED, [false, false, false, false]],
    [OmchaiRole.INFORMED, [false, false, false, false]],
  ])('%s', (role, [drafts, checkpoints, manuscript, production]) => {
    expect(permissionsFor(role, false)).toEqual({
      canEditDrafts: drafts,
      canTickCheckpoints: checkpoints,
      canManageManuscript: manuscript,
      canEditProduction: production,
    });
  });

  it('gives no permissions without a role', () => {
    expect(Object.values(permissionsFor(undefined, false))).toEqual([
      false,
      false,
      false,
      false,
    ]);
  });

  it('gives an admin every permission without a role', () => {
    expect(Object.values(permissionsFor(undefined, true))).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });
});
