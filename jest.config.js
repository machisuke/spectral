export default {
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/*.(ts)'],
  testPathIgnorePatterns: ['/node_modules/', '.karma.test.ts$'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '/node_modules/'],
  setupFilesAfterEnv: ['./setupJest.ts'],
  globalSetup: './setupJest.global.ts',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true,
    },
  },
};
