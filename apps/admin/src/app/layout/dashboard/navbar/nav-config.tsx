import { RoleNameEnum } from '@libs/types';
import {
    AnalyticsTwoTone,
    CategoryTwoTone,
    ReceiptLong,
} from '@mui/icons-material';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import FamilyRestroomTwoToneIcon from '@mui/icons-material/FamilyRestroomTwoTone';
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone';
import LockTwoToneIco from '@mui/icons-material/LockTwoTone';
import MasksTwoToneIcon from '@mui/icons-material/MasksTwoTone';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NoteIcon from '@mui/icons-material/Note';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';
import PercentIcon from '@mui/icons-material/Percent';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PsychologyIcon from '@mui/icons-material/Psychology';
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SickTwoToneIcon from '@mui/icons-material/SickTwoTone';
import StarHalfTwoToneIcon from '@mui/icons-material/StarHalfTwoTone';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useMemo } from 'react';

import { PATH_DASHBOARD } from '../../../routes/paths';
import { NavigationItem } from '../../../types/navigation';


const ICONS = {
    dashboard: <DashboardTwoToneIcon />,
    reports: <AnalyticsTwoTone />,
    project: <NoteIcon />,
    list: <ArticleTwoToneIcon />,
    mail: <EmailTwoToneIcon />,
    user: <PersonOutlineTwoToneIcon />,
    setting: <SettingsTwoToneIcon />,
    clients: <SupervisorAccountIcon />,
    tax: <PercentIcon />,
    designation: <BadgeTwoToneIcon />,
    department: <ApartmentTwoToneIcon />,

    employeeDepartment: <CategoryTwoTone />,
    page: <DescriptionTwoToneIcon />,
    booking: <EventAvailableTwoToneIcon />,
    roles: <AdminPanelSettingsTwoToneIcon />,
    permissions: <LockTwoToneIco />,
    allergy: <MasksTwoToneIcon />,
    rating: <StarHalfTwoToneIcon />,
    specialty: <PsychologyIcon />,
    payment: <PaymentsTwoToneIcon />,
    faq: <QuizTwoToneIcon />,
    family: <SickTwoToneIcon />,
    relationship: <FamilyRestroomTwoToneIcon />,
    hospital: <LocalHospitalTwoToneIcon />,
    appointment: <CalendarMonthTwoToneIcon />,
    chronic: <MonitorHeartIcon />,
    notification: <NotificationsPausedIcon />,
    assets: <ReceiptLong />,
};

export function useNavData() {

    const navigationItems = useMemo(() => ([
        {
            id: 'dashboard',
            groupName: 'OVERVIEW',
            title: 'Dashboard',
            path: PATH_DASHBOARD.root,
            icon: ICONS.dashboard,
            staticPaths: [PATH_DASHBOARD.root]
        },
        {
            id: 'users',
            groupName: 'Users',
            title: 'Users',
            path: '',
            icon: ICONS.user,
            permissions: [RoleNameEnum.ADMIN],
            staticPaths: ['users'],
            children: [
                {
                    id: 'users.list',
                    title: 'Users',
                    path: PATH_DASHBOARD.users.root,
                    permissions: [RoleNameEnum.ADMIN],
                    staticPaths: [PATH_DASHBOARD.users.root],
                },
                {
                    id: 'users.roles',
                    title: 'Roles',
                    path: PATH_DASHBOARD.users.roles,
                    permissions: [RoleNameEnum.ADMIN],
                    staticPaths: [PATH_DASHBOARD.users.roles],
                },
                {
                    id: 'users.permissions',
                    title: 'Permissions',
                    path: PATH_DASHBOARD.users.permissions,
                    permissions: [RoleNameEnum.ADMIN],
                    staticPaths: [PATH_DASHBOARD.users.permissions],
                },
            ],
        },
        {
            id: 'settings',
            groupName: 'Management',
            title: 'Settings',
            path: PATH_DASHBOARD.settings.root,
            icon: ICONS.setting,
            staticPaths: [PATH_DASHBOARD.settings.root]
        },
        {
            id: 'manage',
            groupName: 'Manage',
            title: 'Page',
            path: 'page',
            icon: ICONS.page,
            permissions: [RoleNameEnum.ADMIN],
            staticPaths: ['page'],
        },
    ]), [])

    const groupedItems = [
        ...navigationItems,
    ].reduce((acc, item) => {
        const group = item.groupName || 'Other';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {} as Record<string, NavigationItem[]>);

    const navConfig = Object.keys(groupedItems).map((groupName) => {
        const items = groupedItems[groupName];
        const tree = buildTree(items);

        return {
            subheader: groupName,
            items: tree,
        };
    });
    return navConfig;
}


export function buildTree(items: NavigationItem[]): NavigationItem[] {
    const itemMap = new Map<string, NavigationItem>();
    const roots: NavigationItem[] = [];
    items.forEach((item) => {
        itemMap.set(item.id || '', {
            icon: item.icon,
            permissions: item.permissions,
            order: item.order,
            children: item.children,
            ...item
        });
    });

    items.forEach((item) => {
        const id = item.id || '';
        const parentId = item.parentId || '';
        const navItem = itemMap.get(id);

        if (parentId && itemMap.has(parentId)) {
            const parentItem = itemMap.get(parentId);
            parentItem.children = parentItem?.children || [];
            parentItem.children.push(navItem);
        } else {
            roots.push(navItem);
        }
    });

    return roots;
}
