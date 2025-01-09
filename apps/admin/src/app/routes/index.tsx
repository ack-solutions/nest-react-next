import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { PATH_DASHBOARD } from './paths';
import { Loadable } from '../components';
import AuthGuard from '../guards/auth-guard';
import GuestGuard from '../guards/guest-guard';
import AuthLayout from '../layout/auth';
import DashboardLayout from '../layout/dashboard';


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
const UserChangePassword = Loadable(lazy(() => import('../sections/user/user-change-password')));
const AddEditUser = Loadable(lazy(() => import('../pages/user/add-edit-user')));
const RoleList = Loadable(lazy(() => import('../pages/roles/role-list')));
const AddEditRole = Loadable(lazy(() => import('../pages/roles/add-edit-role')));
const PermissionList = Loadable(lazy(() => import('../pages/user/permission-list')));
const SettingPage = Loadable(lazy(() => import('../pages/setting/setting-page')));
const Settings = Loadable(lazy(() => import('../pages/setting/settings')));
const NotificationSetting = Loadable(lazy(() => import('../pages/setting/notification-setting')));
const PageList = Loadable(lazy(() => import('../pages/page/page-list-page')));

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
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'register',
                    element: <Register />,
                },
                // { path: 'register', element: <Register /> },
                {
                    path: 'forgot-password',
                    element: <ForgotPassword />,
                },
                // { path: 'verify', element: <VerifyCode /> },
                // ...routes.auth,
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
                    path: 'users',
                    children: [
                        {
                            path: 'list',
                            element: <UserList />,
                        },
                        {
                            path: 'edit/:id',
                            element: <AddEditUser />,
                        },
                        {
                            path: 'add',
                            element: <AddEditUser />,
                        },
                        {
                            path: 'roles',
                            element: <RoleList />,
                        },
                        {
                            path: 'roles/edit/:id',
                            element: <AddEditRole />,
                        },
                        {
                            path: 'roles/add',
                            element: <AddEditRole />,
                        },
                        {
                            path: 'permissions',
                            element: <PermissionList />,
                        },
                    ],
                },
                {
                    path: 'pages',
                    children: [
                        {
                            path: '',
                            element: <PageList />,
                        },
                        // { path: 'add', element: <AddEditPage /> },
                        // { path: 'edit/:pageId', element: <AddEditPage /> },
                    ],
                },
                {
                    path: 'settings',
                    element: <SettingPage />,
                    children: [
                        {
                            path: '',
                            element: <Navigate
                                to="email-setting"
                                replace
                            />,
                        },
                        {
                            path: 'email-setting',
                            element: <Settings />,
                        },
                        {
                            path: 'notification-setting',
                            element: <NotificationSetting />,
                        },
                    ],
                },
                {
                    path: 'profile',
                    element: <UserProfile />,
                },
                {
                    path: 'change-password',
                    element: <UserChangePassword />,
                },
                {
                    path: 'profile',
                    element: <UserProfile />,
                },
                {
                    path: 'page',
                    element: <PageList />,
                },
                {
                    path: 'change-password',
                    element: <UserChangePassword />,
                },
            ],
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
