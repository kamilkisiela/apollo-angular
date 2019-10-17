const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApolloCacheNgrx',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: ['apollo-cache', 'apollo-cache-inmemory'],
};
