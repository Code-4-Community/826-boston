import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddDocumentModal from './add-document-modal';
import apiClient from '../../api/apiClient';
import { STORY_DRAFT_CHECKPOINTS } from './checkpoints';

vi.mock('../../api/apiClient', () => ({
  default: {
    getStoryDrafts: vi.fn(),
    updateStoryDraft: vi.fn(),
  },
}));

// Built from the checkpoint list so the tests keep working if it changes
const [metCheckpoint, ...unmetCheckpoints] = STORY_DRAFT_CHECKPOINTS;
const allCheckpointsMet = Object.fromEntries(
  STORY_DRAFT_CHECKPOINTS.map((checkpoint) => [checkpoint.id, true]),
);

const drafts = [
  {
    id: 1,
    docLink: 'https://example.com/jane',
    checkpoints: allCheckpointsMet,
    story: {
      id: 10,
      title: 'A',
      author: { id: 1, name: 'Jane Doe', grade: 6 },
    },
  },
  {
    id: 2,
    docLink: 'https://example.com/risa',
    checkpoints: { [metCheckpoint.id]: true },
    story: { id: 11, title: 'B', author: { id: 2, name: 'Risa Tuffaha' } },
  },
];

const mockApi = apiClient as unknown as {
  getStoryDrafts: ReturnType<typeof vi.fn>;
  updateStoryDraft: ReturnType<typeof vi.fn>;
};

function setup() {
  const onClose = vi.fn();
  const onSaved = vi.fn();
  render(
    <AddDocumentModal anthologyId={5} onClose={onClose} onSaved={onSaved} />,
  );
  return { onClose, onSaved };
}

const search = (text: string) =>
  fireEvent.change(screen.getByPlaceholderText('Search for a student...'), {
    target: { value: text },
  });

// Waits for the drafts to load, then searches for and picks a student
async function selectStudent(query: string, name: string) {
  const handlers = setup();
  const input = screen.getByPlaceholderText('Search for a student...');
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));

  search(query);
  fireEvent.click(screen.getByText(name));
  return handlers;
}

describe('AddDocumentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.getStoryDrafts.mockResolvedValue(drafts);
    mockApi.updateStoryDraft.mockResolvedValue({ message: 'ok' });
  });

  it('requests only unapproved drafts for the anthology', async () => {
    setup();
    await waitFor(() =>
      expect(mockApi.getStoryDrafts).toHaveBeenCalledWith(5, false),
    );
  });

  it('filters results by student name, case-insensitively', async () => {
    setup();
    await waitFor(() => expect(mockApi.getStoryDrafts).toHaveBeenCalled());
    const input = screen.getByPlaceholderText('Search for a student...');
    await waitFor(() =>
      expect((input as HTMLInputElement).disabled).toBe(false),
    );

    search('jAnE');
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.queryByText('Risa Tuffaha')).toBeNull();

    search('ane');
    expect(screen.getByText('No matching drafts')).toBeTruthy();

    search('zzz');
    expect(screen.getByText('No matching drafts')).toBeTruthy();
  });

  it('keeps Add document disabled until a student is picked', async () => {
    setup();
    const add = screen.getByText('Add document') as HTMLButtonElement;
    expect(add.disabled).toBe(true);
  });

  it('lists only the unmet checkpoints for the selected draft', async () => {
    await selectStudent('risa', 'Risa Tuffaha');

    expect(screen.getByText(/have not been met yet/)).toBeTruthy();
    unmetCheckpoints.forEach((checkpoint) =>
      expect(screen.getByText(checkpoint.label)).toBeTruthy(),
    );
    expect(screen.queryByText(metCheckpoint.label)).toBeNull();
  });

  it('shows no checkpoint warning when every checkpoint is met', async () => {
    await selectStudent('jane', 'Jane Doe');

    expect(screen.queryByText(/have not been met yet/)).toBeNull();
  });

  it('approves the selected draft and closes', async () => {
    const { onClose, onSaved } = await selectStudent('risa', 'Risa Tuffaha');

    fireEvent.click(screen.getByText('Add document'));
    await waitFor(() =>
      expect(mockApi.updateStoryDraft).toHaveBeenCalledWith(2, {
        inManuscript: true,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSaved).toHaveBeenCalled();
  });
});
