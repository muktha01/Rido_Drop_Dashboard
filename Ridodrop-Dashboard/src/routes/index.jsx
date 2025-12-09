import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

// Root level redirects
const RootRedirects = {
  path: '/',
  children: [
    {
      path: 'customers',
      element: <Navigate to="/dashboard/customers" replace />
    },
    {
      path: 'customers/:id',
      element: <Navigate to="/dashboard/customers/:id" replace />
    }
  ]
};

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([AuthenticationRoutes, RootRedirects, MainRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
