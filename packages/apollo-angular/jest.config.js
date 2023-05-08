module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.(ts|mjs|js)$': [
        'jest-preset-angular', {
          tsconfig: '<rootDir>/tsconfig.test.json',
        }
      ],
  },
  moduleNameMapper: {
    '^apollo-angular': '<rootDir>/src/',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  preset: 'jest-preset-angular',
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  moduleFileExtensions: ['js', 'ts', 'mjs'],
  testRegex: '\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/tests/_setup.ts'],
  collectCoverage: false,
  verbose: false,
  // notify: true,
  errorOnDeprecated: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
