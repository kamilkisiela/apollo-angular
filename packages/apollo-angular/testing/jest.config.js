const jestConfig = require('../../../jest.config');

module.exports = Object.assign(jestConfig(), {
  transform: {
    '.ts': '<rootDir>/../../../node_modules/ts-jest/preprocessor.js',
  },
  moduleNameMapper: {
    'apollo-angular': '<rootDir>/../',
  },
});
