import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from '../../api/apiClient';
import { OmchaiRole } from '../../types';
import { permissionsFor } from './permissions';
import DocumentsTable from './documents-table';
import ApprovedDocumentsView from './approved-documents-view';
import StoryDraftDetailPanel, {
  type StoryDraftDetail,
} from './story-draft-detail-panel';
import ProductionInfoView from './production-info-view';
import { STORY_DRAFT_CHECKPOINTS } from './checkpoints';

vi.mock('../../api/apiClient', () => ({
  default: {
    getStoryDocuments: vi.fn(),
    getStoryDrafts: vi.fn(),
    updateStoryDraft: vi.fn(),
    updateAuthor: vi.fn(),
    deleteStory: vi.fn(),
    getProductionInfo: vi.fn(),
    updateProductionInfo: vi.fn(),
    createProductionInfo: vi.fn(),
    updateAnthology: vi.fn(),
  },
}));

const mockApi = apiClient as unknown as Record<
  string,
  ReturnType<typeof vi.fn>
>;

const as = (role: OmchaiRole | undefined, isAdmin = false) =>
  permissionsFor(role, isAdmin);

const row = {
  storyId: 1,
  storyDraftId: 3,
  authorId: 5,
  consent: false,
  firstName: 'Jane',
  lastName: 'Doe',
  grade: 6,
  docLink: 'https://example.com/jane',
  description: '',
  nameInBook: '',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.getStoryDocuments.mockResolvedValue({
    data: [row],
    total: 1,
    page: 1,
  });
  mockApi.updateStoryDraft.mockResolvedValue({});
  mockApi.updateAuthor.mockResolvedValue({});
  mockApi.getProductionInfo.mockResolvedValue({
    id: 1,
    printedBy: 'Boston Press',
  });
});

const addButton = () => screen.queryByLabelText('Add story draft');
const deleteButton = () =>
  screen.queryByLabelText('Delete document for Jane Doe');
const consentBox = () =>
  screen.getByLabelText('Consent for Jane Doe') as HTMLInputElement;

describe('Documents tab', () => {
  const renderAs = (role: OmchaiRole | undefined, isAdmin = false) => {
    const p = as(role, isAdmin);
    render(
      <DocumentsTable
        anthologyId={5}
        canAdd={p.canEditDrafts}
        canEdit={p.canEditDrafts}
      />,
    );
    return screen.findByText('Jane');
  };

  it('shows an Informed user no add, delete or consent controls', async () => {
    await renderAs(OmchaiRole.INFORMED);

    expect(addButton()).toBeNull();
    expect(deleteButton()).toBeNull();
    expect(consentBox().disabled).toBe(true);
  });

  it('lets a Helper add, delete and toggle consent', async () => {
    await renderAs(OmchaiRole.HELPER);

    expect(addButton()).toBeTruthy();
    expect(deleteButton()).toBeTruthy();
    expect(consentBox().disabled).toBe(false);
  });

  it('hides the controls from an Approver', async () => {
    await renderAs(OmchaiRole.APPROVER);

    expect(addButton()).toBeNull();
    expect(deleteButton()).toBeNull();
  });

  it('shows an admin with no role every control', async () => {
    await renderAs(undefined, true);

    expect(addButton()).toBeTruthy();
    expect(deleteButton()).toBeTruthy();
  });
});

describe('Approved Documents tab', () => {
  const renderAs = (role: OmchaiRole) => {
    const p = as(role);
    render(
      <ApprovedDocumentsView
        anthologyId={5}
        canManageManuscript={p.canManageManuscript}
        canEditDrafts={p.canEditDrafts}
      />,
    );
    return screen.findByText('Jane');
  };

  it('lets an Approver add a draft to the manuscript', async () => {
    await renderAs(OmchaiRole.APPROVER);
    expect(addButton()).toBeTruthy();
  });

  it('does not let a Helper add a draft to the manuscript', async () => {
    await renderAs(OmchaiRole.HELPER);
    expect(addButton()).toBeNull();
  });

  it('shows an Informed user no controls', async () => {
    await renderAs(OmchaiRole.INFORMED);
    expect(addButton()).toBeNull();
    expect(deleteButton()).toBeNull();
  });
});

describe('Story draft side panel', () => {
  const draft: StoryDraftDetail = {
    storyDraftId: 3,
    authorId: 5,
    firstName: 'Jane',
    lastName: 'Doe',
    bio: '',
    grade: 6,
    nameInBook: '',
    studentConsent: false,
    docLink: 'https://example.com/jane',
    checkpoints: {},
  };
  const [firstCheckpoint] = STORY_DRAFT_CHECKPOINTS;
  const checkpointBox = () =>
    document.getElementById(
      `checkpoint-${firstCheckpoint.id}`,
    ) as HTMLInputElement;

  const renderAs = (role: OmchaiRole) => {
    const p = as(role);
    render(
      <StoryDraftDetailPanel
        draft={draft}
        onClose={vi.fn()}
        onSaved={vi.fn()}
        canEditDrafts={p.canEditDrafts}
        canTickCheckpoints={p.canTickCheckpoints}
      />,
    );
  };
  const close = () =>
    fireEvent.click(screen.getByLabelText('Close story draft details'));

  it('makes everything read-only for an Informed user', () => {
    renderAs(OmchaiRole.INFORMED);

    expect(
      (screen.getByLabelText('Last name') as HTMLInputElement).readOnly,
    ).toBe(true);
    expect(
      (screen.getByLabelText('Document link') as HTMLInputElement).readOnly,
    ).toBe(true);
    expect(
      (screen.getByLabelText('Consent on file') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(checkpointBox().disabled).toBe(true);
  });

  it('only saves checkpoints for an Approver, even if other fields changed', async () => {
    renderAs(OmchaiRole.APPROVER);
    // readOnly doesn't stop a programmatic change, so save() must filter too
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Changed' },
    });
    fireEvent.click(checkpointBox());
    close();

    await waitFor(() => expect(mockApi.updateStoryDraft).toHaveBeenCalled());
    expect(mockApi.updateStoryDraft).toHaveBeenCalledWith(3, {
      checkpoints: { [firstCheckpoint.id]: true },
    });
    expect(mockApi.updateAuthor).not.toHaveBeenCalled();
  });

  it('saves draft and author edits for a Helper, but not checkpoints', async () => {
    renderAs(OmchaiRole.HELPER);
    expect(checkpointBox().disabled).toBe(true);

    fireEvent.change(screen.getByLabelText('Document link'), {
      target: { value: 'https://example.com/new' },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Smith' },
    });
    close();

    await waitFor(() => expect(mockApi.updateStoryDraft).toHaveBeenCalled());
    expect(mockApi.updateStoryDraft).toHaveBeenCalledWith(3, {
      docLink: 'https://example.com/new',
    });
    // the author edit carries the draft so the API can check its publication
    expect(mockApi.updateAuthor).toHaveBeenCalledWith(
      5,
      { name: 'Jane Smith' },
      3,
    );
  });
});

describe('Production & Distribution tab', () => {
  const renderAs = (role: OmchaiRole | undefined, isAdmin = false) => {
    render(
      <ProductionInfoView
        anthologyId={5}
        shopifyUrl="https://shop.example.com"
        isbn="123"
        canEdit={as(role, isAdmin).canEditProduction}
      />,
    );
    return screen.findByText('Boston Press');
  };

  it.each([OmchaiRole.CONSULTED, OmchaiRole.HELPER, OmchaiRole.APPROVER])(
    'shows %s the values with no edit controls',
    async (role) => {
      await renderAs(role);
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    },
  );

  it.each([OmchaiRole.OWNER, OmchaiRole.MANAGER])(
    'lets %s edit every field',
    async (role) => {
      await renderAs(role);
      expect(screen.getAllByRole('button')).toHaveLength(7);
    },
  );

  it('lets an admin with no role edit', async () => {
    await renderAs(undefined, true);
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });
});
