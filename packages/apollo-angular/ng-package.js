const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApollo',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: ['semver', 'extract-files'],
};
