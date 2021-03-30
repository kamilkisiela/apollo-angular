module.exports = {
  transform: {
    '.ts': 'ts-jest',
  },
  moduleNameMapper: {
    '^apollo-angular': '<rootDir>',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  // preset: "jest-preset-angular",
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/tests/_setup.ts'],
  collectCoverage: false,
  verbose: false,
  notify: true,
  errorOnDeprecated: true,
  testURL: 'http://localhost/',
};
