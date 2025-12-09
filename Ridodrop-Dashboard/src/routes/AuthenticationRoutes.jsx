import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));

// admin authentication routing
const AdminLoginPage = Loadable(lazy(() => import('views/admin/AdminLogin')));
const AdminRegisterPage = Loadable(lazy(() => import('views/admin/AdminRegister')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/admin/login" replace />
    },
    {
      path: 'pages/login',
      element: <LoginPage />
    },
    {
      path: 'pages/register',
      element: <RegisterPage />
    },
    {
      path: 'admin/login',
      element: <AdminLoginPage />
    },
    {
      path: 'admin/register',
      element: <AdminRegisterPage />
    }
  ]
};

export default AuthenticationRoutes;
