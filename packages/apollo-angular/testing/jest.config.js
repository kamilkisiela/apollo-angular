const jestConfig = require('../../../jest.config');

module.exports = Object.assign(jestConfig(), {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.test.json',
    },
  },
  transform: {
    '.ts': 'ts-jest',
  },
  moduleNameMapper: {
    'apollo-angular': '<rootDir>/../',
  },
});
