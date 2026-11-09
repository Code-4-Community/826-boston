import { OmchaiRole } from '../omchai/omchai.entity';
import { CreateStoryDraftDto } from '../story-draft/dto/create-story-draft.dto';

/**
 * What a user can do on a publication, decided by their OMCHAI role there.
 * Admins can do everything; see OmchaiService.assertCan.
 *
 * The frontend mirrors this table in
 * apps/frontend/src/containers/projects-publication/permissions.ts.
 */
export enum OmchaiAction {
  VIEW = 'VIEW',
  EDIT_DRAFTS = 'EDIT_DRAFTS',
  TICK_CHECKPOINTS = 'TICK_CHECKPOINTS',
  MANAGE_MANUSCRIPT = 'MANAGE_MANUSCRIPT',
  EDIT_PRODUCTION = 'EDIT_PRODUCTION',
}

export const ACTION_ROLES: Record<OmchaiAction, OmchaiRole[]> = {
  [OmchaiAction.VIEW]: Object.values(OmchaiRole),
  [OmchaiAction.EDIT_DRAFTS]: [
    OmchaiRole.OWNER,
    OmchaiRole.MANAGER,
    OmchaiRole.HELPER,
  ],
  [OmchaiAction.TICK_CHECKPOINTS]: [
    OmchaiRole.OWNER,
    OmchaiRole.MANAGER,
    OmchaiRole.APPROVER,
  ],
  [OmchaiAction.MANAGE_MANUSCRIPT]: [
    OmchaiRole.OWNER,
    OmchaiRole.MANAGER,
    OmchaiRole.APPROVER,
  ],
  [OmchaiAction.EDIT_PRODUCTION]: [OmchaiRole.OWNER, OmchaiRole.MANAGER],
};

export function roleCan(
  role: OmchaiRole | undefined,
  action: OmchaiAction,
): boolean {
  return !!role && ACTION_ROLES[action].includes(role);
}

/**
 * The action each story-draft field needs. Typed against the DTO so that
 * adding a field without classifying it here is a compile error.
 * `storyId` is null because it picks the publication rather than changing
 * anything on it; callers resolve the publication from it separately.
 */
export const DRAFT_FIELD_ACTION: Record<
  keyof CreateStoryDraftDto,
  OmchaiAction | null
> = {
  storyId: null,
  docLink: OmchaiAction.EDIT_DRAFTS,
  notes: OmchaiAction.EDIT_DRAFTS,
  studentConsent: OmchaiAction.EDIT_DRAFTS,
  submissionRound: OmchaiAction.TICK_CHECKPOINTS,
  editRound: OmchaiAction.TICK_CHECKPOINTS,
  proofread: OmchaiAction.TICK_CHECKPOINTS,
  checkpoints: OmchaiAction.TICK_CHECKPOINTS,
  inManuscript: OmchaiAction.MANAGE_MANUSCRIPT,
};

/**
 * The actions needed to write the fields present in a validated draft body.
 * Fields set to undefined are ignored, since the service skips them too.
 * An unknown key (shouldn't happen after whitelisting) fails closed by
 * requiring every write action.
 */
export function draftActionsFor(
  body: Partial<CreateStoryDraftDto>,
): OmchaiAction[] {
  const actions = new Set<OmchaiAction>();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;
    if (!(key in DRAFT_FIELD_ACTION)) {
      actions.add(OmchaiAction.EDIT_DRAFTS);
      actions.add(OmchaiAction.TICK_CHECKPOINTS);
      actions.add(OmchaiAction.MANAGE_MANUSCRIPT);
      continue;
    }
    const action = DRAFT_FIELD_ACTION[key as keyof CreateStoryDraftDto];
    if (action) actions.add(action);
  }
  return [...actions];
}
