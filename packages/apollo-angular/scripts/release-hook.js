const semver = require('semver');
const fs = require('fs');

module.exports = function(name) {
  if (name !== 'apollo-angular') {
    return;
  }

  compare('apollo-angular');
  compare('apollo-angular-link-http');
};

function compare(name) {
  // 'apollo-angular': '^1.4.4-beta.0',
  const findPackage = new RegExp(`'${name}'\:\\s*'([^']+)'`);
  const herePath = 'packages/apollo-angular/schematics/install/index.ts';
  const packagePath = `packages/${name}/package.json`;
  const inHere = findPackage.exec(
    fs.readFileSync(herePath, {encoding: 'utf-8'}),
  )[1];
  const inPackage = JSON.parse(
    fs.readFileSync(packagePath, {encoding: 'utf-8'}),
  ).version;

  if (!semver.satisfies(inPackage, inHere)) {
    throw new Error(
      `Version of ${name} does not satisfy the range in apollo-angular schematics`,
    );
  }
}
