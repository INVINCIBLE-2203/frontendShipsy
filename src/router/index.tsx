
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard';
import TaskList from '../pages/tasks/TaskList';
import Organizations from '../pages/Organizations';
import OrganizationDetails from '../pages/OrganizationDetails';
import AuthGuard from './AuthGuard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/organizations',
    element: <AuthGuard><Organizations /></AuthGuard>,
  },
  {
    path: '/organizations/:id',
    element: <AuthGuard><OrganizationDetails /></AuthGuard>,
  },
  {
    path: '/projects/:projectId/tasks',
    element: <AuthGuard><TaskList /></AuthGuard>,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
