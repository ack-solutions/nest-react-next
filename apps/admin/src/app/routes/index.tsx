import { lazy, useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { PATH_DASHBOARD } from './paths';
import AuthLayout from '../layout/auth';
import DashboardLayout from '../layout/dashboard';
import GuestGuard from '../guards/guest-guard';
import AuthGuard from '../guards/auth-guard';
import { Loadable } from '../components';

// Main
const NotFound = Loadable(lazy(() => import('../pages/error/not-found')));

// // Authentication
const Login = Loadable(lazy(() => import('../pages/auth/login')));
const Register = Loadable(lazy(() => import('../pages/auth/register')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/forget-password')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/dashboard')));
// User
const UserList = Loadable(lazy(() => import('../pages/user/user-list')));
const UserProfile = Loadable(lazy(() => import('../pages/user/user-profile')));
const UserChangePassword = Loadable(lazy(() => import('../pages/user/user-change-password')));
const AddEditUser = Loadable(lazy(() => import('../pages/user/add-edit-user')));
const RoleList = Loadable(lazy(() => import('../pages/roles/role-list')));
const PermissionList = Loadable(lazy(() => import('../pages/user/permission-list')));


export default function Router() {
    // const routes = useMemo(() => getPluginRoutes(), []);

    return useRoutes([
        {
            path: 'auth',
            element: (
                <GuestGuard>
                    <AuthLayout />
                </GuestGuard>
            ),
            children: [
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                // { path: 'register', element: <Register /> },
                { path: 'forgot-password', element: <ForgotPassword /> },
                // { path: 'verify', element: <VerifyCode /> },
                // ...routes.auth,
            ],
        },

        // Dashboard Routes
        { path: '', element: <Navigate to={PATH_DASHBOARD.root} replace /> },
        {
            path: 'app',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                { path: 'app', element: <Dashboard /> },
                { path: 'dashboard', element: <Dashboard /> },
                {
                    path: 'users',
                    children: [
                        { path: 'list', element: <UserList /> },
                        { path: 'edit/:id', element: <AddEditUser /> },
                        { path: 'add', element: <AddEditUser /> },
                        { path: 'roles', element: <RoleList /> },
                        { path: 'permissions', element: <PermissionList /> },
                    ],
                },
                { path: 'profile', element: <UserProfile />  },
                { path: 'change-password', element: <UserChangePassword />  },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
        {
            path: '*',
            children: [{ path: '404', element: <NotFound /> }],
        },
    ]);
}
