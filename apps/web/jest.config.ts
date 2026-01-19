import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    displayName: 'web',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@web/(.*)$': '<rootDir>/src/$1',
        '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
        '^@sections/(.*)$': '<rootDir>/src/sections/$1',
        '^@libs/(.*)$': '<rootDir>/../../packages/$1/src',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../coverage/apps/web',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
