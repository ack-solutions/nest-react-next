function path(root: string, sublink: string) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/app';

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    verify: path(ROOTS_AUTH, '/verify'),
    forgotPassword: path(ROOTS_AUTH, '/forgot-password')
};

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    pricing: '/pricing',
    payment: '/payment',
    about: '/about-us',
    contact: '/contact-us',
    faqs: '/faqs',
    page404: '/404',
    page500: '/500',
    components: '/components'
};

export const PATH_DASHBOARD = {
    root: path(ROOTS_DASHBOARD, '/dashboard'),
    reports: {
        root: path(ROOTS_DASHBOARD, '/reports'),
    },
    products: {
        root: path(ROOTS_DASHBOARD, '/products'),
    },
    users: {
        root: path(ROOTS_DASHBOARD, '/users/list'),
        edit: path(ROOTS_DASHBOARD, '/users/edit'),
        add: path(ROOTS_DASHBOARD, '/users/add'),
        roles: path(ROOTS_DASHBOARD, '/users/roles'),
        editRole: path(ROOTS_DASHBOARD, '/users/roles/edit'),
        addRole: path(ROOTS_DASHBOARD, '/users/roles/add'),
        permissions: path(ROOTS_DASHBOARD, '/users/permissions'),
    },
    profile: {
        root: path(ROOTS_DASHBOARD, '/profile'),
    },
    changePassword: {
        root: path(ROOTS_DASHBOARD, '/change-password'),
    },
    page: {
        root: path(ROOTS_DASHBOARD, '/pages'),
        add: path(ROOTS_DASHBOARD, '/pages/add'),
        edit: path(ROOTS_DASHBOARD, '/pages/edit/:pageId'),
    },

    settings: {
        root: path(ROOTS_DASHBOARD, '/settings'),
        emailSetting: path(ROOTS_DASHBOARD, '/settings/email-setting'),
        notificationSetting: path(ROOTS_DASHBOARD, '/settings/notification-setting'),
        emailLayout: path(ROOTS_DASHBOARD, '/settings/email-layout'),

    },
    // page: {
    //   root: path(ROOTS_DASHBOARD, '/page'),
    // },
};
