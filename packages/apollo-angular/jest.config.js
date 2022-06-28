export default {
  rootDir: '.',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ["ts", "js", "json", "mjs"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      useESM: true,
    }
  },
  transform: {
    "^.+\\.(ts|js|mjs)$": "jest-preset-angular",
  },
  moduleNameMapper: {
    '^apollo-angular': '<rootDir>',
  },
  testRegex: '\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/tests/_setup.ts'],
  collectCoverage: false,
  verbose: false,
  errorOnDeprecated: true,
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testEnvironment: 'jsdom'
};
