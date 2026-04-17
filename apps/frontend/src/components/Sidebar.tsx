import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import useAuth from '../hooks/useAuth';
import Role from '@api/dtos/role';

import Logo from '../assets/icons/826-boston-logo.png';
import HomeIcon from '../assets/icons/home.svg';
import LibraryIcon from '../assets/icons/library.svg';
import LibraryActiveIcon from '../assets/icons/library-active.svg';
import ProjectsIcon from '../assets/icons/projects.svg';
import ResourcesIcon from '../assets/icons/resources.svg';
import PeopleIcon from '../assets/icons/people.svg';
import CollapseArrowIcon from '../assets/icons/collapse-arrow.svg';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const [, , user] = useAuth();
  const { signOut } = useAuthenticator();
  const profileRef = useRef<HTMLDivElement>(null);

  const isLibraryActive =
    location.pathname.startsWith('/archive') || location.pathname === '/';
  const isAuthorized =
    user?.role === Role.ADMIN || user?.role === Role.STANDARD;

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <aside className={`root-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div>
        {/* Logo */}
        <div className="sidebar-logo-section">
          {!collapsed && (
            <img src={Logo} alt="826 Boston" className="sidebar-logo" />
          )}
          <img
            src={CollapseArrowIcon}
            alt=""
            className={`sidebar-collapse-arrow ${collapsed ? 'collapsed' : ''}`}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Home */}
          <NavLink to="/" className="sidebar-nav-item">
            <div className="sidebar-nav-item-content">
              <div className="sidebar-nav-item-left">
                <img src={HomeIcon} alt="" className="sidebar-nav-icon" />
                {!collapsed && <span className="sidebar-nav-label">Home</span>}
              </div>
            </div>
          </NavLink>

          {/* Library - Expandable Section */}
          <div className="sidebar-library-section">
            <NavLink to="/archive/published" className="sidebar-library-header">
              <div className="sidebar-library-header-content">
                <div className="sidebar-library-header-left">
                  <img
                    src={isLibraryActive ? LibraryActiveIcon : LibraryIcon}
                    alt=""
                    className="sidebar-nav-icon"
                  />
                  {!collapsed && (
                    <span className="sidebar-nav-label sidebar-nav-label--bold">
                      Archive
                    </span>
                  )}
                </div>
              </div>
            </NavLink>
          </div>

          {/* Projects */}
          <NavLink to="/projects" className="sidebar-nav-item">
            <div className="sidebar-nav-item-content">
              <div className="sidebar-nav-item-left">
                <img src={ProjectsIcon} alt="" className="sidebar-nav-icon" />
                {!collapsed && (
                  <span className="sidebar-nav-label">Projects</span>
                )}
              </div>
            </div>
          </NavLink>

          {/* Resources */}
          <NavLink to="/resources" className="sidebar-nav-item">
            <div className="sidebar-nav-item-content">
              <div className="sidebar-nav-item-left">
                <img src={ResourcesIcon} alt="" className="sidebar-nav-icon" />
                {!collapsed && (
                  <span className="sidebar-nav-label">Resources</span>
                )}
              </div>
            </div>
          </NavLink>

          {/* People */}
          {isAuthorized && (
            <NavLink to="/people" className="sidebar-nav-item sidebar-nav-link">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img src={PeopleIcon} alt="" className="sidebar-nav-icon" />
                  {!collapsed && (
                    <span className="sidebar-nav-label">People</span>
                  )}
                </div>
              </div>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile-section" ref={profileRef}>
        {profileOpen && (
          <div className="profile-modal">
            <div className="profile-modal-header">
              <div className="profile-modal-avatar">{initials}</div>
              <div className="profile-modal-info">
                <span className="profile-modal-name">
                  {user?.firstName} {user?.lastName}
                </span>
                {user?.title && (
                  <span className="profile-modal-job-title">{user.title}</span>
                )}
              </div>
            </div>
            <div className="profile-modal-divider" />
            <button
              type="button"
              className="profile-modal-btn"
              onClick={() => setProfileOpen(false)}
            >
              Manage account
            </button>
            <div className="profile-modal-divider" />
            <button
              type="button"
              className="profile-modal-btn profile-modal-btn--signout"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        )}
        <button
          type="button"
          className="sidebar-profile-btn"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <div className="sidebar-profile-avatar">{initials}</div>
          {!collapsed && (
            <span className="sidebar-profile-name">
              {user?.firstName} {user?.lastName}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
