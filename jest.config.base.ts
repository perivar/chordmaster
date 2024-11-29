// jest.config.base.ts
import type { Config } from 'jest';

// By default, all files inside `node_modules` are not transformed. But some 3rd party
// modules are published as untranspiled, Jest will not understand the code in these modules.
// To overcome this, exclude these modules in the ignore pattern.
export const untranspiledModulePatterns = [
    "(jest-)?react-native",
    "@react-native-community",
    "expo(nent)?",
    "@expo(nent)?/.*",
    "react-navigation",
    "@react-navigation/.*",
    "@unimodules/.*",
    "unimodules",
    "sentry-expo",
    "native-base",
    "react-native-svg",
    "chord-symbol"
];

const baseConfig: Config = {
    preset: 'ts-jest', // Use ts-jest for TypeScript
    testEnvironment: 'node', // Or 'jsdom' depending on your app's requirements
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your monorepo structure
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    coverageDirectory: '<rootDir>/coverage/',
    collectCoverageFrom: ['**/src/**/*.{ts,tsx}', '!**/node_modules/**'],
    testRegex: "/__tests__/.*.(spec|test).ts$",
    verbose: true
};

export default baseConfig;
