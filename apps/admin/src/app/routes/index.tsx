import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { PATH_DASHBOARD } from './paths';
import { Loadable } from '../components/loadable';
import AuthGuard from '../guards/auth-guard';
import GuestGuard from '../guards/guest-guard';
import AuthLayout from '../layout/auth';
import DashboardLayout from '../layout/dashboard';


// Main
const NotFound = Loadable(lazy(() => import('../pages/error/not-found')));
const ComingSoon = Loadable(lazy(() => import('../components/coming-soon')));
const Maintenance = Loadable(lazy(() => import('../pages/maintenance')));

// // Authentication
const Login = Loadable(lazy(() => import('../pages/auth/login')));
const Register = Loadable(lazy(() => import('../pages/auth/register')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/forgot-password')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/dashboard')));
// const Product = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
// const Reports = Loadable(lazy(() => import('../pages/reports/Reports')));
const UserList = Loadable(lazy(() => import('../pages/user/user-list')));
const EditUser = Loadable(lazy(() => import('../pages/user/edit-user')));
const AddUser = Loadable(lazy(() => import('../pages/user/add-user')));
const RoleList = Loadable(
    lazy(() => import('../pages/roles/role-list')),
);
const AddEditRole = Loadable(
    lazy(() => import('../pages/roles/add-edit-role')),
);
// const PermissionList = Loadable(
//     lazy(() => import('../pages/permission/permission-list')),
// );
const UserProfile = Loadable(
    lazy(() => import('../pages/profile/user-profile')),
);

export default function Router() {
    // const routes = useMemo(() => getPluginRoutes(), []);

    return useRoutes([
        {
            path: 'auth',
            element: (
                <AuthLayout />
            ),
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <Login />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'register',
                    element: (
                        <GuestGuard>
                            <Register />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'forgot-password',
                    element: (
                        <GuestGuard>
                            <ForgotPassword />
                        </GuestGuard>
                    ),
                },
                //  ...routes.auth,
            ],
        },

        // Dashboard Routes
        {
            path: '',
            element: <Navigate
                to={PATH_DASHBOARD.root}
                replace
            />,
        },
        {
            path: 'app',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: 'app',
                    element: <Dashboard />,
                },
                {
                    path: 'dashboard',
                    element: <Dashboard />,
                },
                {
                    path: 'reports',
                    element: <ComingSoon />,
                },
                {
                    path: 'users',
                    children: [
                        {
                            path: 'list',
                            element: <UserList />,
                        },
                        {
                            path: 'edit/:userId',
                            element: <EditUser />,
                        },
                        {
                            path: 'create',
                            element: <AddUser />,
                        },
                        {
                            path: 'roles',
                            element: <RoleList />,
                        },
                        {
                            path: 'roles/edit/:roleId',
                            element: <AddEditRole />,
                        },
                        {
                            path: 'roles/create',
                            element: <AddEditRole />,
                        },
                        // {
                        //     path: 'permissions',
                        //     element: <PermissionList />,
                        // },
                    ],
                },
                {
                    path: 'profile',
                    element: <UserProfile />,
                },
                //  ...routes.app,
                {
                    path: '*',
                    element: <NotFound />,
                },
            ],

        },
        //  ...routes.other,
        // Main Routes

        {
            path: 'maintenance',
            element: <Maintenance />,
        },
        {
            path: '*',
            element: <Navigate
                to="/404"
                replace
            />,
        },

        {
            path: '*',
            children: [
                {
                    path: '404',
                    element: <NotFound />,
                },
            ],
        },
    ]);
}
