module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.(ts|mjs|js)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '^apollo-angular': '<rootDir>',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  preset: 'jest-preset-angular',
  resolver: '<rootDir>/../../node_modules/jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  moduleFileExtensions: ['js', 'ts', 'mjs'],
  testRegex: '\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/tests/_setup.ts'],
  collectCoverage: false,
  verbose: false,
  // notify: true,
  errorOnDeprecated: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  }
};
