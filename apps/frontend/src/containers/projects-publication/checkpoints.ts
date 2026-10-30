/**
 * Checkpoints shown on a story draft.
 *
 * These are PLACEHOLDERS - the real set is still being deliberated with the
 * client. To change them, edit this list: add, remove, rename or reorder
 * entries and the Checkpoints tab follows automatically.
 *
 * `id` is what gets persisted (StoryDraft.checkpoints is a free-form
 * id -> boolean map), so avoid renaming an `id` once drafts have been saved
 * against it; change only the `label` if the wording changes.
 */
export interface CheckpointDefinition {
  id: string;
  label: string;
}

export const STORY_DRAFT_CHECKPOINTS: readonly CheckpointDefinition[] = [
  { id: 'draftOneSubmitted', label: 'Draft 1 Submitted' },
  { id: 'draftTwoSubmitted', label: 'Draft 2 Submitted' },
  { id: 'finalDraftSubmitted', label: 'Final Draft Submitted' },
  { id: 'copyedit', label: 'Copyedit' },
  { id: 'proofread', label: 'Proofread' },
  { id: 'authorApproval', label: 'Author Approval' },
];
