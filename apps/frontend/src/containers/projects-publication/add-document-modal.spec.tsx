import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddDocumentModal from './add-document-modal';
import apiClient from '../../api/apiClient';

vi.mock('../../api/apiClient', () => ({
  default: {
    getStoryDrafts: vi.fn(),
    updateStoryDraft: vi.fn(),
  },
}));

const drafts = [
  {
    id: 1,
    docLink: 'https://example.com/jane',
    proofread: true,
    story: {
      id: 10,
      title: 'A',
      author: { id: 1, name: 'Jane Doe', grade: 6 },
    },
  },
  {
    id: 2,
    docLink: 'https://example.com/risa',
    proofread: false,
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

  it('approves the selected draft and closes', async () => {
    const { onClose, onSaved } = setup();
    const input = screen.getByPlaceholderText('Search for a student...');
    await waitFor(() =>
      expect((input as HTMLInputElement).disabled).toBe(false),
    );

    search('risa');
    fireEvent.click(screen.getByText('Risa Tuffaha'));
    expect(screen.getByText(/Proofreading/)).toBeTruthy();

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
