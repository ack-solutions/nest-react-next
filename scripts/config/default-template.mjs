export const DEFAULT_TEMPLATE = Object.freeze({
    app: {
        name: '${APP_NAME:-ACK Platform}',
        description: '${APP_DESCRIPTION:-Full-stack starter for Nest, Vite, and Next}',
    },
    branding: {
        primaryColor: '#0B5CF1',
        secondaryColor: '#1BC5BD',
        logo: '/assets/logo.svg',
    },
    urls: {
        api: '${API_URL:-http://localhost:3333}',
        admin: '${ADMIN_URL:-http://localhost:4200}',
        web: '${WEB_URL:-http://localhost:3000}',
        cdn: '${CDN_URL:-}',
    },
    features: {
        enableSignup: '${ENABLE_SIGNUP:-true}',
    },
});
