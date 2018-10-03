const semver = require('semver');
const fs = require('fs');

module.exports = function(name) {
  if (name !== 'apollo-angular-boost') {
    return;
  }

  compare('apollo-angular');
  compare('apollo-angular-link-http');
};

function compare(name) {
  const boostPath = 'packages/apollo-angular-boost/package.json';
  const packagePath = `packages/${name}/package.json`;
  const inBoost = JSON.parse(fs.readFileSync(boostPath, {encoding: 'utf-8'}))
    .dependencies[name];
  const inPackage = JSON.parse(
    fs.readFileSync(packagePath, {encoding: 'utf-8'}),
  ).version;

  if(!semver.satisfies(inPackage, inBoost)) {
    throw new Error(`Version of ${name} does not satisfy the range in apollo-angular-boost`);
  }
}
