const fs = require('fs');

module.exports = function(name, version) {
  switch (name) {
    case 'apollo-angular':
      return forCore(version);
    case 'apollo-angular-link-http':
      return forHttp(version);
  }
};

function forCore(version) {
  bump('apollo-angular', version);
}

function forHttp(version) {
  bump('apollo-angular-link-http', version);
}

function bump(name, version) {
  console.log(`[apollo-angular] bumping ${name} in schematics`);
  const installPath = 'packages/apollo-angular/schematics/install/index.ts';
  const data = fs.readFileSync(installPath, {encoding: 'utf-8'});

  fs.writeFileSync(
    installPath,
    data.replace(
      new RegExp(`'${name}':\\s* '\\^[^']+'`),
      `'${name}': '^${version}'`,
    ),
    {encoding: 'utf-8'},
  );
}
