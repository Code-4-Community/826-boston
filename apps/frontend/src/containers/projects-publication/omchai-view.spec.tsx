import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OmchaiView, { LAST_OWNER_MESSAGE } from './omchai-view';
import apiClient from '../../api/apiClient';
import Role from '../../api/dtos/role';
import User from '../../api/dtos/user.dto';
import { OmchaiEntry, OmchaiRole } from '../../types';

vi.mock('../../api/apiClient', () => ({
  default: {
    getOmchaiByAnthology: vi.fn(),
    getUsers: vi.fn(),
    createOmchaiAssignment: vi.fn(),
    deleteOmchaiAssignment: vi.fn(),
  },
}));

const mockApi = apiClient as unknown as {
  getOmchaiByAnthology: ReturnType<typeof vi.fn>;
  getUsers: ReturnType<typeof vi.fn>;
  createOmchaiAssignment: ReturnType<typeof vi.fn>;
  deleteOmchaiAssignment: ReturnType<typeof vi.fn>;
};

const person = (id: number, firstName: string, lastName: string): User => ({
  id,
  firstName,
  lastName,
  email: `${firstName.toLowerCase()}@826boston.org`,
  title: '',
  role: Role.STANDARD,
});

const miranda = person(1, 'Miranda', 'Burel');
const alison = person(2, 'Alison', 'Lee');
const bob = person(3, 'Bob', 'Smith');
const dana = person(4, 'Dana', 'Cruz');

const entry = (id: number, user: User, role: OmchaiRole): OmchaiEntry => ({
  id,
  anthologyId: 5,
  userId: user.id,
  role,
  datetimeAssigned: '2025-01-15',
  user,
});

const entries = [
  entry(10, miranda, OmchaiRole.OWNER),
  entry(11, alison, OmchaiRole.MANAGER),
  entry(12, bob, OmchaiRole.CONSULTED),
];

// What the viewer may change: nothing (Consulted and below), the team
// (Owner, Manager) or everything (Admin)
type Access = 'none' | 'team' | 'all';

async function setup(access: Access) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <OmchaiView
        anthologyId={5}
        canManageTeam={access !== 'none'}
        canManageLeads={access === 'all'}
      />
    </QueryClientProvider>,
  );
  await screen.findByText('Miranda Burel');
}

describe('OmchaiView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.getOmchaiByAnthology.mockResolvedValue(entries);
    mockApi.getUsers.mockResolvedValue([miranda, alison, bob, dana]);
  });

  it('shows every role with its description in a tooltip', async () => {
    await setup('none');

    expect(screen.getByLabelText('About Owner')).toBeTruthy();
    expect(
      screen.getByText('Assists with or does some of the work.'),
    ).toBeTruthy();
  });

  it('is read-only for a Consulted user, with empty roles left blank', async () => {
    await setup('none');

    expect(screen.queryByText('Add assignment.')).toBeNull();
    expect(screen.queryByLabelText(/^Remove /)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    expect(mockApi.getUsers).not.toHaveBeenCalled();
  });

  it('lets an Owner edit Consulted through Informed but not Owner or Manager', async () => {
    await setup('team');

    expect(screen.queryByLabelText('Add Owner assignment')).toBeNull();
    expect(screen.queryByLabelText('Add Manager assignment')).toBeNull();
    expect(
      screen.queryByLabelText('Remove Alison Lee from Manager'),
    ).toBeNull();
    expect(screen.getByLabelText('Add Helper assignment')).toBeTruthy();
    expect(
      screen.getByLabelText('Remove Bob Smith from Consulted'),
    ).toBeTruthy();
  });

  it('lets an Admin edit every role', async () => {
    await setup('all');

    expect(screen.getByLabelText('Add Owner assignment')).toBeTruthy();
    expect(
      screen.getByLabelText('Remove Alison Lee from Manager'),
    ).toBeTruthy();
  });

  it('greys out staff who already have a role', async () => {
    await setup('team');
    fireEvent.click(screen.getByLabelText('Add Helper assignment'));

    const bobOption = await screen.findByRole('option', { name: /Bob Smith/ });
    expect((bobOption as HTMLButtonElement).disabled).toBe(true);
    expect(bobOption.textContent).toContain('Already Consulted');
    const danaOption = screen.getByRole('option', { name: /Dana Cruz/ });
    expect((danaOption as HTMLButtonElement).disabled).toBe(false);
  });

  it('searches staff and adds the picked person right away', async () => {
    mockApi.createOmchaiAssignment.mockResolvedValue(
      entry(13, dana, OmchaiRole.HELPER),
    );
    await setup('team');
    fireEvent.click(screen.getByLabelText('Add Helper assignment'));
    fireEvent.change(await screen.findByPlaceholderText('Search staff...'), {
      target: { value: 'dana' },
    });

    expect(screen.queryByRole('option', { name: /Bob Smith/ })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: /Dana Cruz/ }));

    await screen.findByLabelText('Remove Dana Cruz from Helper');
    expect(mockApi.createOmchaiAssignment).toHaveBeenCalledWith(
      expect.objectContaining({
        anthologyId: 5,
        userId: 4,
        role: OmchaiRole.HELPER,
      }),
    );
    expect(screen.getByRole('status').textContent).toBe('Saved');
  });

  it('removes an assignment', async () => {
    mockApi.deleteOmchaiAssignment.mockResolvedValue(entries[2]);
    await setup('team');

    fireEvent.click(screen.getByLabelText('Remove Bob Smith from Consulted'));

    await waitFor(() => expect(screen.queryByText('Bob Smith')).toBeNull());
    expect(mockApi.deleteOmchaiAssignment).toHaveBeenCalledWith(12);
  });

  it('blocks removing the last Owner', async () => {
    await setup('all');

    fireEvent.click(screen.getByLabelText('Remove Miranda Burel from Owner'));

    expect(screen.getByRole('alert').textContent).toBe(LAST_OWNER_MESSAGE);
    expect(mockApi.deleteOmchaiAssignment).not.toHaveBeenCalled();
    expect(screen.getByText('Miranda Burel')).toBeTruthy();
  });

  it('shows the API error when a save is rejected', async () => {
    mockApi.deleteOmchaiAssignment.mockRejectedValue({
      response: {
        data: {
          message: 'Only Admins can change who the Owner and Manager are.',
        },
      },
    });
    await setup('team');

    fireEvent.click(screen.getByLabelText('Remove Bob Smith from Consulted'));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Only Admins can change who the Owner and Manager are.',
    );
    expect(screen.getByText('Bob Smith')).toBeTruthy();
  });
});
