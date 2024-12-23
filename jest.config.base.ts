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
    // had to add isolatedModules: true to make sure the jest tests did not take forever to start
    // https://github.com/jestjs/jest/issues/10833
    transform: {
        "\\.[jt]sx?$": [
            "ts-jest",
            { tsconfig: "tsconfig.json", isolatedModules: true },
        ],
    },
    transformIgnorePatterns: [
        `node_modules/(?!.*(${untranspiledModulePatterns.join("|")}))`,
    ],
    testRegex: "/__tests__/.*\\.(test|spec)\\.[tj]sx?$",
    coverageDirectory: '<rootDir>/coverage/',
    collectCoverageFrom: ['**/src/**/*.{ts,tsx}', '!**/node_modules/**'],
    verbose: true
};

export default baseConfig;
