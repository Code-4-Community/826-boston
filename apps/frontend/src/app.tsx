import { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import './styles.css';
import apiClient from '@api/apiClient';
import Root from '@containers/root';
import NotFound from '@containers/404';
import ArchivedPublications from '@containers/archived-publications';
import PublicationView from '@containers/archived-publications/individual-publication/publication-view';
import Login from '@containers/auth/login';
import ProtectedRoute from '@containers/auth/ProtectedRoute';
import People from '@containers/people';
import Resources from '@containers/resources';
import Role from '@api/dtos/role';
import CreatePublicationModal from '@containers/create-publication-modal';
import ProjectPublicationView from '@containers/projects-publication/project-publication-view';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      // public routes
      { index: true, element: <Navigate to="/archive/published" replace /> },
      {
        // archive
        path: 'archive',
        children: [
          {
            index: true,
            element: <Navigate to="/archive/published" replace />,
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
      // admin and volunteer routes
      {
        element: <ProtectedRoute roles={[Role.ADMIN, Role.STANDARD]} />,
        children: [{ path: 'people', element: <People /> }],
      },
      {
        element: <ProtectedRoute roles={[Role.ADMIN, Role.STANDARD]} />,
        children: [
          {
            path: 'projects',
            children: [
              {
                index: true,
                element: <Navigate to="/projects/drafts" replace />,
              },
              {
                path: ':tab',
                element: <ArchivedPublications mode="projects" />,
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
          TODO: set default page for admins/standard to projects page?
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
]);

export const App: React.FC = () => {
  useEffect(() => {
    apiClient.getHello().then((res) => console.log(res));
  }, []);

  return <RouterProvider router={router} />;
  /* for temp testing of create publication modal */
  /* return (
    <>
    <RouterProvider router={router} />
    <CreatePublicationModal
    onClose={() => {}}
    onSave={() => {}}
    />
    </>
    );
  */
};

export default App;
