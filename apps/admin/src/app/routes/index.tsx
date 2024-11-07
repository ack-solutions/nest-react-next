import { lazy, useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { PATH_DASHBOARD } from './paths';
import AuthLayout from '../layout/auth';
import DashboardLayout from '../layout/dashboard';
import GuestGuard from '../guards/guest-guard';
import AuthGuard from '../guards/auth-guard';
import { Loadable } from '@mlm/react-core';

// Main
const NotFound = Loadable(lazy(() => import('../pages/error/not-found')));

// // Authentication
const Login = Loadable(lazy(() => import('../pages/auth/login')));
const Register = Loadable(lazy(() => import('../pages/auth/register')));
// const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// const ForgotPassword = Loadable(
//   lazy(() => import('../pages/auth/ForgotPassword'))
// );
// const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/dashboard')));
// User
const UserList = Loadable(lazy(() => import('../pages/user/user-list')));
const AddEditUser = Loadable(lazy(() => import('../pages/user/add-edit-user')));
const RoleList = Loadable(lazy(() => import('../pages/roles/role-list')));
const PermissionList = Loadable(lazy(() => import('../pages/user/permission-list')));
// const Product = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
// const Reports = Loadable(lazy(() => import('../pages/reports/Reports')));
// const UserList = Loadable(lazy(() => import('../pages/users/UserList')));
// const UserRoles = Loadable(lazy(() => import('../pages/users/UserRoles')));

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
                // { path: 'forgot-password', element: <ForgotPassword /> },
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
                        // { path: 'add', element: <AddEditUser /> },
                        { path: 'roles', element: <RoleList /> },
                        { path: 'permissions', element: <PermissionList /> },
                    ],
                },
         
                // ...routes.app,
                // { path: 'product', element: <Product /> },
                // { path: 'reports', element: <Reports /> },
                // { path: 'businesses', element: <Business /> },
                // { path: 'employee-department', element: <EmployeeDepartment /> },
                // { path: 'employee-designation', element: <EmployeeDesignation /> },
                // { path: 'payment-mode', element: <PaymentMode /> },
                // { path: 'payment-method', element: <PaymentMethod /> },
                // { path: 'profile', element: <Profile /> },
                // {
                //   path: 'users',
                //   children: [
                //     { path: 'list', element: <UserList /> },
                //     { path: 'edit/:id', element: <AddEditUser /> },
                //     { path: 'add', element: <AddEditUser /> },
                //     { path: 'roles', element: <UserRoles /> },
                //     { path: 'permissions', element: <Permissions /> },
                //   ],
                // },
            ],
        },
        // ...routes.other,
        // Main Routes
        { path: '*', element: <Navigate to="/404" replace /> },
        {
            path: '*',
            children: [{ path: '404', element: <NotFound /> }],
        },
    ]);
}
