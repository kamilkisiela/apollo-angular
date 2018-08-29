const jestConfig = require('../../../jest.config');

module.exports = Object.assign(jestConfig(), {
  transform: {
    '.ts': 'ts-jest',
  },
});
