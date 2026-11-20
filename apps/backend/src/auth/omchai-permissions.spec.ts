import { OmchaiRole } from '../omchai/omchai.entity';
import { SubmissionRound, EditRound } from '../story-draft/types';
import { OmchaiAction, draftActionsFor, roleCan } from './omchai-permissions';

const { OWNER, MANAGER, CONSULTED, HELPER, APPROVER, INFORMED } = OmchaiRole;

// The issue's permission table, one row per action.
const TABLE: [OmchaiAction, OmchaiRole[]][] = [
  [OmchaiAction.VIEW, [OWNER, MANAGER, CONSULTED, HELPER, APPROVER, INFORMED]],
  [OmchaiAction.EDIT_DRAFTS, [OWNER, MANAGER, HELPER]],
  [OmchaiAction.TICK_CHECKPOINTS, [OWNER, MANAGER, APPROVER]],
  [OmchaiAction.MANAGE_MANUSCRIPT, [OWNER, MANAGER, APPROVER]],
  [OmchaiAction.EDIT_PRODUCTION, [OWNER, MANAGER]],
];

describe('roleCan', () => {
  describe.each(TABLE)('%s', (action, allowed) => {
    it.each(Object.values(OmchaiRole))('%s', (role) => {
      expect(roleCan(role, action)).toBe(allowed.includes(role));
    });

    it('denies a user with no role', () => {
      expect(roleCan(undefined, action)).toBe(false);
    });
  });
});

describe('draftActionsFor', () => {
  it.each([
    [{ docLink: 'x' }, [OmchaiAction.EDIT_DRAFTS]],
    [{ notes: ['n'] }, [OmchaiAction.EDIT_DRAFTS]],
    [{ studentConsent: true }, [OmchaiAction.EDIT_DRAFTS]],
    [{ checkpoints: { copyedit: true } }, [OmchaiAction.TICK_CHECKPOINTS]],
    [{ submissionRound: SubmissionRound.TWO }, [OmchaiAction.TICK_CHECKPOINTS]],
    [{ editRound: EditRound.TWO }, [OmchaiAction.TICK_CHECKPOINTS]],
    [{ proofread: true }, [OmchaiAction.TICK_CHECKPOINTS]],
    [{ inManuscript: true }, [OmchaiAction.MANAGE_MANUSCRIPT]],
    [{ inManuscript: false }, [OmchaiAction.MANAGE_MANUSCRIPT]],
    [{ storyId: 3 }, []],
  ])('%o needs %o', (body, expected) => {
    expect(draftActionsFor(body)).toEqual(expected);
  });

  it('collects every action a mixed body needs', () => {
    expect(
      draftActionsFor({
        docLink: 'x',
        checkpoints: { copyedit: true },
        inManuscript: true,
      }).sort(),
    ).toEqual(
      [
        OmchaiAction.EDIT_DRAFTS,
        OmchaiAction.TICK_CHECKPOINTS,
        OmchaiAction.MANAGE_MANUSCRIPT,
      ].sort(),
    );
  });

  it('ignores fields set to undefined', () => {
    expect(draftActionsFor({ docLink: undefined, proofread: true })).toEqual([
      OmchaiAction.TICK_CHECKPOINTS,
    ]);
  });

  it('fails closed on a field it does not know', () => {
    const body = { surprise: 1 } as unknown as Parameters<
      typeof draftActionsFor
    >[0];
    expect(draftActionsFor(body).sort()).toEqual(
      [
        OmchaiAction.EDIT_DRAFTS,
        OmchaiAction.TICK_CHECKPOINTS,
        OmchaiAction.MANAGE_MANUSCRIPT,
      ].sort(),
    );
  });
});
