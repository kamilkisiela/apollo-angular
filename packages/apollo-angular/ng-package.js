const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApollo',
    umdModuleIds,
  },
  allowedNonPeerDependencies: ['semver', 'extract-files'],
};
