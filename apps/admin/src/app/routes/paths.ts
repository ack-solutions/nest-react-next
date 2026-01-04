function path(root: string, subLink: string) {
    return `${root}${subLink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/app';

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    onboarding: path(ROOTS_AUTH, '/onboarding'),
    verify: path(ROOTS_AUTH, '/verify'),
    forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    pricing: '/pricing',
    payment: '/payment',
    about: '/about-us',
    contact: '/contact-us',
    faqs: '/faqs',
    page404: path(ROOTS_DASHBOARD, '/404'),
    page500: '/500',
    components: '/components',
};

export const PATH_DASHBOARD = {
    root: path(ROOTS_DASHBOARD, '/dashboard'),
    reports: {
        root: path(ROOTS_DASHBOARD, '/reports'),
    },
    products: {
        root: path(ROOTS_DASHBOARD, '/product'),
        add: path(ROOTS_DASHBOARD, '/product/create'),
        edit: (id: string) => path(ROOTS_DASHBOARD, `/product/edit/${id}`),
        view: (id: string) => path(ROOTS_DASHBOARD, `/product/view/${id}`),
        category: {
            root: path(ROOTS_DASHBOARD, '/product-category'),
            add: path(ROOTS_DASHBOARD, '/product-category/create'),
            edit: (id: string) => path(ROOTS_DASHBOARD, `/product-category/edit/${id}`),
            view: (id: string) => path(ROOTS_DASHBOARD, `/product-category/view/${id}`),
        },
        brand: {
            root: path(ROOTS_DASHBOARD, '/brand'),
        },
    },
    orders: {
        root: path(ROOTS_DASHBOARD, '/order'),
        view: (id: string) => path(ROOTS_DASHBOARD, `/order/view/${id}`),
    },
    users: {
        root: path(ROOTS_DASHBOARD, '/users/list'),
        edit: (userId: string) => path(ROOTS_DASHBOARD, `/users/edit/${userId}`),
        view: path(ROOTS_DASHBOARD, '/users/edit'),
        create: path(ROOTS_DASHBOARD, '/users/create'),
        roles: {
            root: path(ROOTS_DASHBOARD, '/users/roles'),
            edit: (roleId: string) => path(ROOTS_DASHBOARD, `/users/roles/edit/${roleId}`),
            add: path(ROOTS_DASHBOARD, '/users/roles/create'),
        },
        permissions: path(ROOTS_DASHBOARD, '/users/permissions'),
    },
    profile: {
        root: path(ROOTS_DASHBOARD, '/profile'),
    },
    customer: {
        root: path(ROOTS_DASHBOARD, '/customer'),
        edit: (id: string) => path(ROOTS_DASHBOARD, `/customer/edit/${id}`),
        create: path(ROOTS_DASHBOARD, '/customer/create'),
    },
    location: {
        root: path(ROOTS_DASHBOARD, '/settings/location'),
        add: path(ROOTS_DASHBOARD, '/settings/location/add'),
        edit: (locationId: string) => path(ROOTS_DASHBOARD, `/settings/location/edit/${locationId}`),
        view: (id: string) => path(ROOTS_DASHBOARD, `/settings/location/view/${id}`),
    },
    expense: {
        root: path(ROOTS_DASHBOARD, '/expense'),
        edit: (id: string) => path(ROOTS_DASHBOARD, `/expense/edit/${id}`),
        add: path(ROOTS_DASHBOARD, '/expense/create'),
        view: (id: string) => path(ROOTS_DASHBOARD, `/expense/view/${id}`),
        vendor: {
            root: path(ROOTS_DASHBOARD, '/expense/vendors'),
            edit: (id: string) => path(ROOTS_DASHBOARD, `/expense/vendors/edit/${id}`),
            add: path(ROOTS_DASHBOARD, '/expense/vendors/create'),
        },
        category: {
            root: path(ROOTS_DASHBOARD, '/expense/category'),
            edit: (id: string) => path(ROOTS_DASHBOARD, `/expense/category/edit/${id}`),
            add: path(ROOTS_DASHBOARD, '/expense/category/create'),
            view: (id: string) => path(ROOTS_DASHBOARD, `/expense/category/view/${id}`),
        },
    },
    pages: {
        root: path(ROOTS_DASHBOARD, '/pages'),
        create: path(ROOTS_DASHBOARD, '/pages/create'),
        edit: (id: string) => path(ROOTS_DASHBOARD, `/pages/edit/${id}`),
        view: (id: string) => path(ROOTS_DASHBOARD, `/pages/view/${id}`),
    },
    emailTemplates: {
        root: path(ROOTS_DASHBOARD, '/email-templates'),
        create: path(ROOTS_DASHBOARD, '/email-templates/create'),
        edit: (id: string) => path(ROOTS_DASHBOARD, `/email-templates/edit/${id}`),
        view: (id: string) => path(ROOTS_DASHBOARD, `/email-templates/view/${id}`),
    },
    templates: {
        root: path(ROOTS_DASHBOARD, '/templates'),
        edit: (templateId: string) => path(ROOTS_DASHBOARD, `/templates/edit/${templateId}`),
    },
    templateLayouts: {
        root: path(ROOTS_DASHBOARD, '/template-layouts'),
        edit: (templateLayoutId: string) => path(ROOTS_DASHBOARD, `/template-layouts/edit/${templateLayoutId}`),
    },
    settings: {
        root: path(ROOTS_DASHBOARD, '/settings'),
        paymentMethod: path(ROOTS_DASHBOARD, '/settings/payment-methods'),
        account: path(ROOTS_DASHBOARD, '/settings/account'),
        location: path(ROOTS_DASHBOARD, '/settings/location'),
    },
    invoice: {
        root: path(ROOTS_DASHBOARD, '/invoice'),
        edit: (invoiceId: string) => path(ROOTS_DASHBOARD, `/invoice/edit/${invoiceId}`),
        add: path(ROOTS_DASHBOARD, '/invoice/create'),
        view: (invoiceId: string) => path(ROOTS_DASHBOARD, `/invoice/view/${invoiceId}`),
    },
    income: {
        root: path(ROOTS_DASHBOARD, '/incomes'),
    },
    inquiry: {
        root: path(ROOTS_DASHBOARD, '/inquiry'),
    },
    // test: {
    //     root: path(ROOTS_DASHBOARD, '/test'),
    //     edit: (id: string) => path(ROOTS_DASHBOARD, `/test/edit/${id}`),
    //     create: path(ROOTS_DASHBOARD, '/test/create'),
    // },
};
