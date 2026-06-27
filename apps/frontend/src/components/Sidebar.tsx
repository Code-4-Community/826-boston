import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Role from '@api/dtos/role';

import Logo from '../assets/icons/826-boston-logo.png';
import HomeIcon from '../assets/icons/home.svg';
import LibraryIcon from '../assets/icons/library.svg';
import LibraryActiveIcon from '../assets/icons/library-active.svg';
import ProjectsIcon from '../assets/icons/projects.svg';
import ResourcesIcon from '../assets/icons/resources.svg';
import PeopleIcon from '../assets/icons/people.svg';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CollapseArrowIcon from '../assets/icons/collapse-arrow.svg';
import LogoutIcon from '../assets/icons/logout.svg';
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import CognitoAuthConfig from '../../../shared/aws-exports';
import { useNavigate } from 'react-router-dom';

Amplify.configure(CognitoAuthConfig);

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [, , user] = useAuth();
  const navigate = useNavigate();

  const isLibraryActive =
    location.pathname.startsWith('/library') || location.pathname === '/';
  const isProjectsActive =
    location.pathname.startsWith('/projects') || location.pathname === '/';
  const isResourcesActive =
    location.pathname.startsWith('/resouces') || location.pathname === '/';
  const isPeopleActive =
    location.pathname.startsWith('/people') || location.pathname === '/';
  const isAuthorized =
    user?.role === Role.ADMIN || user?.role === Role.STANDARD;

  async function handleSignOut() {
    await signOut();
  }

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
          {/* Library - Expandable Section */}
          <div className="sidebar-library-section">
            <NavLink to="/library/published" className="sidebar-library-header">
              <div className="sidebar-library-header-content">
                <div className="sidebar-library-header-left">
                  <img
                    src={isLibraryActive ? LibraryActiveIcon : LibraryIcon}
                    alt=""
                    className="sidebar-nav-icon"
                  />
                  {!collapsed && (
                    <span
                      className="sidebar-nav-label"
                      style={{ fontWeight: isLibraryActive ? 700 : 400 }}
                    >
                      Library
                    </span>
                  )}
                </div>
              </div>
            </NavLink>
          </div>

          {/* Projects */}
          {isAuthorized && (
            <NavLink to="/projects" className="sidebar-nav-item">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img
                    src={ProjectsIcon}
                    alt=""
                    className="sidebar-nav-icon"
                    style={{
                      filter: isProjectsActive
                        ? 'brightness(0) saturate(100%) invert(57%) sepia(99%) saturate(456%) hue-rotate(1deg) brightness(98%) contrast(98%)'
                        : 'none',
                    }}
                  />
                  {!collapsed && (
                    <span
                      className="sidebar-nav-label"
                      style={{ fontWeight: isProjectsActive ? 700 : 400 }}
                    >
                      Projects
                    </span>
                  )}
                </div>
              </div>
            </NavLink>
          )}

          {/* Resources : TODO*/}
          {/* <NavLink to="/resources" className="sidebar-nav-item">
            <div className="sidebar-nav-item-content">
              <div className="sidebar-nav-item-left">
                <img src={ResourcesIcon} alt="" className="sidebar-nav-icon" />
                {!collapsed && (
                  <span className="sidebar-nav-label">Resources</span>
                )}
              </div>
            </div>
          </NavLink> */}

          {/* People */}
          {isAuthorized && (
            <NavLink to="/people" className="sidebar-nav-item sidebar-nav-link">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img
                    src={PeopleIcon}
                    alt=""
                    className="sidebar-nav-icon"
                    style={{
                      filter: isPeopleActive
                        ? 'brightness(0) saturate(100%) invert(57%) sepia(99%) saturate(456%) hue-rotate(1deg) brightness(98%) contrast(98%)'
                        : 'none',
                    }}
                  />
                  {!collapsed && (
                    <span
                      className="sidebar-nav-label"
                      style={{ fontWeight: isPeopleActive ? 700 : 400 }}
                    >
                      People
                    </span>
                  )}
                </div>
              </div>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Login/Logout */}
      <div className="sidebar-logout-section">
        {user ? (
          <button
            type="button"
            className="sidebar-logout"
            onClick={handleSignOut}
          >
            <img src={LogoutIcon} alt="" className="sidebar-logout-icon" />
            {!collapsed && <span>Log Out</span>}
          </button>
        ) : (
          <button
            type="button"
            className="sidebar-logout"
            onClick={() => navigate('/login')}
          >
            <img src={LogoutIcon} alt="" className="sidebar-logout-icon" />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
