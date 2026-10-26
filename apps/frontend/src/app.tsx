import { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
  useParams,
} from 'react-router-dom';

import './styles.css';
import apiClient from '@api/apiClient';
import Root from '@containers/root';
import NotFound from '@containers/404';
import ArchivedPublications from '@containers/archived-publications';
import PublicationView from '@containers/archived-publications/individual-publication/publication-view';
import Login from '@containers/auth/Login';
import ProtectedRoute from '@containers/auth/ProtectedRoute';
import People from '@containers/people';
import Resources from '@containers/resources';
import Role from '@api/dtos/role';
import ProjectPublicationView from '@containers/projects-publication/project-publication-view';
import SignUp from '@containers/auth/SignUp';
import ForgotPassword from '@containers/auth/ForgotPassword';

/** Old /projects/* links (bookmarks, emails) moved to /tracker/*. */
const ProjectsRedirect: React.FC = () => {
  const { '*': rest = '' } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/tracker/${rest}${search}${hash}`} replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      // public routes
      { index: true, element: <Navigate to="/library/published" replace /> },
      {
        path: 'library',
        children: [
          {
            index: true,
            element: <Navigate to="/library/published" replace />,
          },
          {
            path: ':tab',
            element: <ArchivedPublications mode="archive" />,
          },
          {
            path: 'publication/:id?',
            element: <PublicationView />,
          },
        ],
      },
      { path: 'resources', element: <Resources /> },
      { path: 'projects/*', element: <ProjectsRedirect /> },
      // admin and volunteer routes
      {
        element: <ProtectedRoute roles={[Role.ADMIN, Role.STANDARD]} />,
        children: [{ path: 'people', element: <People /> }],
      },
      {
        element: <ProtectedRoute roles={[Role.ADMIN, Role.STANDARD]} />,
        children: [
          {
            path: 'tracker',
            children: [
              {
                index: true,
                element: <Navigate to="/tracker/all" replace />,
              },
              {
                path: ':tab',
                element: <ArchivedPublications mode="tracker" />,
              },
              {
                path: 'publication/:id?',
                element: <ProjectPublicationView />,
              },
            ],
          },
          {
            path: 'test',
            element: <NotFound />,
          },
          /*
          TODO: set default page for admins/standard to tracker page?
          {index: true,
            element: <Projects />
          }*/
        ],
      },

      // TODO: admin routes (ex. adding admin/standard)
      {
        path: 'admin',
        element: <ProtectedRoute roles={[Role.ADMIN]} />,
        children: [
          /*
          TODO: set default page for admins
          */
        ],
      },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <SignUp /> },
  { path: 'forgot-password', element: <ForgotPassword /> },
]);

export const App: React.FC = () => {
  useEffect(() => {
    apiClient.getHello().then((res) => console.log(res));
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
