import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '@api/apiClient';
import Role from '@api/dtos/role';
import User from '@api/dtos/user.dto';
import { OmchaiEntry } from '../../types';
import useAuth from '../../hooks/useAuth';
import CreateUserModal from '../create-user-modal';
import SearchIcon from '../../assets/icons/search.svg';
import FilterIcon from '../../assets/icons/funnel.svg';
import MenuDotsIcon from '../../assets/icons/menu-dots.svg';
import ProfilePlaceholder from '../../assets/images/profile-placeholder.png';
import './people.css';

const hasAdminRole = (role: Role | string | null | undefined) =>
  String(role).toUpperCase() === 'ADMIN';

const PersonCard: React.FC<{
  user: User;
  onOpen: (user: User) => void;
  onMenuToggle: () => void;
  canManageMembers: boolean;
}> = ({ user, onOpen, onMenuToggle, canManageMembers }) => (
  <article className="people-card" onClick={() => onOpen(user)}>
    <img className="people-card__image" src={ProfilePlaceholder} alt="" />
    <div className="people-card__info">
      <div className="people-card__content">
        <strong className="people-card__name">
          {user.firstName} {user.lastName}
        </strong>
        <span className="people-card__position">
          {user.title || 'No position'}
        </span>
        <div className="people-card__pronouns-row">
          <span className="people-card__pronouns">
            {user.pronouns?.trim() || 'No Pronouns Set'}
          </span>
          {canManageMembers && (
            <button
              type="button"
              className="people-card__menu"
              aria-label={`Open ${user.firstName} ${user.lastName}`}
              onClick={(event) => {
                event.stopPropagation();
                onMenuToggle();
              }}
            >
              <img src={MenuDotsIcon} alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  </article>
);

const MemberDrawer: React.FC<{
  user: User;
  onClose: () => void;
  canManageMembers: boolean;
}> = ({ user, onClose, canManageMembers }) => {
  const {
    data: assignments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['omchai', 'user', user.id],
    queryFn: () => apiClient.getOmchaiByUser(user.id),
    enabled: Boolean(user.id),
  });
  const projects = (assignments ?? []).filter(
    (assignment) => assignment.anthology,
  );

  return (
    <div className="people-drawer-overlay" onClick={onClose}>
      <aside
        className="people-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="people-drawer__close-row">
          <button
            type="button"
            className="people-icon-button"
            onClick={onClose}
            aria-label="Close member details"
          >
            x
          </button>
        </div>
        <img className="people-drawer__image" src={ProfilePlaceholder} alt="" />
        <div className="people-drawer__name-row">
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <button type="button" className="people-drawer__edit">
            Edit
          </button>
        </div>
        <p className="people-drawer__position">{user.title || 'No position'}</p>
        <p className="people-drawer__pronouns">
          {user.pronouns?.trim() || 'No Pronouns Set'}
        </p>
        <div className="people-drawer__divider" />
        <h3 className="people-drawer__projects-heading">Projects</h3>
        {isLoading && (
          <p className="people-drawer__empty">Loading projects...</p>
        )}
        {isError && (
          <p className="people-drawer__empty">Unable to load projects.</p>
        )}
        {!isLoading && !isError && projects.length === 0 && (
          <p className="people-drawer__empty">No projects assigned.</p>
        )}
        {!isLoading && !isError && projects.length > 0 && (
          <div className="people-drawer__projects">
            {projects.map((assignment) => (
              <ProjectCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
        {canManageMembers && (
          <div className="people-drawer__actions">
            <button type="button" className="people-drawer__remove">
              Remove
            </button>
            <button type="button" className="people-drawer__admin">
              Make admin
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

const ProjectCard: React.FC<{ assignment: OmchaiEntry }> = ({ assignment }) => {
  const project = assignment.anthology;
  if (!project) return null;

  const modified = project.publishedDate
    ? new Date(project.publishedDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not available';
  const authors = Array.from(
    new Set(
      (project.stories ?? [])
        .map((story) => story.author?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ).join(', ');

  return (
    <article className="people-project-card">
      <img
        className="people-project-card__image"
        src={project.photoUrl || project.photo_url || ProfilePlaceholder}
        alt=""
      />
      <div className="people-project-card__info">
        <strong>{project.title}</strong>
        <span>{authors || 'No author listed'}</span>
        <span>Last modified {modified}</span>
      </div>
    </article>
  );
};

const People: React.FC = () => {
  const [, , currentUser] = useAuth();
  const {
    isLoading,
    isError,
    data: users,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [positionsSelected, setPositionsSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuUserId, setMenuUserId] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const canManageMembers = hasAdminRole(currentUser?.role);

  useEffect(() => {
    if (!filterOpen && menuUserId === null) return undefined;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (filterOpen && !filterRef.current?.contains(target)) {
        setFilterOpen(false);
      }

      if (menuUserId !== null) {
        const card = target.closest<HTMLElement>('.people-card-wrap');
        if (!card || card.dataset.memberId !== String(menuUserId)) {
          setMenuUserId(null);
        }
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [filterOpen, menuUserId]);

  const positions = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          (users ?? [])
            .map((user) => user.title)
            .filter((title): title is string => Boolean(title)),
        ),
      ),
    [users],
  );
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (users ?? []).filter((user) => {
      const matchesSearch = `${user.firstName} ${user.lastName} ${
        user.title ?? ''
      }`
        .toLowerCase()
        .includes(query);
      return (
        matchesSearch &&
        (positionsSelected.length === 0 ||
          positionsSelected.includes(user.title ?? ''))
      );
    });
  }, [positionsSelected, search, users]);

  const togglePosition = (value: string) => {
    setPositionsSelected((selected) =>
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const createUserMutation = useMutation(
    (form: {
      firstName: string;
      lastName: string;
      email: string;
      role: Role;
      title: string;
    }) => apiClient.createUser(form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        setShowModal(false);
      },
    },
  );

  return (
    <div className="people-wrapper">
      <div className="people-header">
        <h1 className="people-title-heading">People</h1>
        <div className="people-toolbar">
          <label className="people-search">
            <input
              type="search"
              placeholder="Search for a member..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <img src={SearchIcon} alt="" />
          </label>
          <div className="people-filter" ref={filterRef}>
            <button
              type="button"
              className="people-filter__button"
              onClick={() => setFilterOpen((open) => !open)}
            >
              <img src={FilterIcon} alt="" />
              <span>
                {positionsSelected.length === 0 ? 'All positions' : 'Position'}
              </span>
            </button>
            {filterOpen && (
              <div className="people-filter__menu">
                {positions.map((item) => (
                  <label className="people-filter__option" key={item}>
                    <input
                      type="checkbox"
                      checked={positionsSelected.includes(item)}
                      onChange={() => togglePosition(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="people-create-btn"
            onClick={() => setShowModal(true)}
          >
            Add member
          </button>
        </div>
      </div>

      <div className="people-grid">
        {isLoading && <div className="people-state-message">Loading...</div>}
        {isError && (
          <div className="people-state-message">Failed to load users.</div>
        )}
        {!isLoading && !isError && users?.length === 0 && (
          <div className="people-state-message">No users found.</div>
        )}
        {!isLoading &&
          !isError &&
          filteredUsers.map((user) => (
            <div
              className="people-card-wrap"
              data-member-id={user.id}
              key={user.id}
            >
              <PersonCard
                user={user}
                onOpen={(member) => {
                  setSelectedUser(member);
                  setMenuUserId(null);
                }}
                onMenuToggle={() =>
                  setMenuUserId((openId) =>
                    openId === user.id ? null : user.id,
                  )
                }
                canManageMembers={canManageMembers}
              />
              {canManageMembers && menuUserId === user.id && (
                <div className="people-member-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setMenuUserId(null);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button">Remove</button>
                </div>
              )}
            </div>
          ))}
      </div>
      {showModal && (
        <CreateUserModal
          positions={positions}
          onClose={() => setShowModal(false)}
          onSave={(form) =>
            createUserMutation.mutate(
              form as {
                firstName: string;
                lastName: string;
                email: string;
                role: Role;
                title: string;
              },
            )
          }
        />
      )}
      {selectedUser && (
        <MemberDrawer
          user={selectedUser}
          canManageMembers={canManageMembers}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default People;
