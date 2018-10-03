#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const shelljs = require('shelljs');

program
  .command('version <name> <version>', 'Sets a new version of a package')
  .action((name, version) => {
    console.log('> Package:', name);
    setVersion(name, version);
  });

program
  .command('bump <name> <type>', 'Bumps a version of a package')
  .option('-i, --preid <preid>', 'type of prerelease - x.x.x-[PREID].x')
  .action((name, type, cmd) => {
    console.log('> Package:', name);

    const version = semver.inc(
      getVersionOfPackage(name),
      type,
      cmd.preid || 'beta',
    );

    setVersion(name, version);
  });

program
  .command('release <name>', 'Releases a new version of a package')
  .action(name => {
    console.log(`> Release: ${name}`);

    const version = getVersionOfPackage(name);
    const prerelease = semver.prerelease(version);

    runHooks('release', name, version);

    const withTag = prerelease ? `-- --tag next` : ``;

    shelljs.exec(`(cd packages/${name} && npm run deploy ${withTag})`);
  });

/**
 * Changes a version of a package
 * @param {string} name of package
 * @param {string} version of package
 */
function setVersion(name, version) {
  console.log('');
  console.log('> Current version:', getVersionOfPackage(name));
  console.log('> Requested version:', version);

  if (!semver.valid(version)) {
    throw new Error('Invalid version');
  }

  if (!semver.gt(version, getVersionOfPackage(name))) {
    throw new Error('Version should be greater than the current one');
  }

  const pkg = readPackageJson(name);
  const findVersion = /"version"\:\s*"[^"]+"/;

  if (!findVersion.test(pkg)) {
    throw new Error('Request package.json does not have "version" field');
  }

  runHooks('version', name, version);

  writePackageJson(name, pkg.replace(findVersion, `"version": "${version}"`));

  console.log(`> Version changed: ${getVersionOfPackage(name)}`);
}

/**
 * Runs hooks on every package
 * @param {string} type of action (release | version)
 * @param {string} name of package that a command was ran for
 * @param {string} version of package
 */
function runHooks(type, name, version) {
  const packages = fs
    .readdirSync(path.resolve(__dirname, '../packages'))
    .filter(dir =>
      fs.lstatSync(path.resolve(__dirname, '../packages', dir)).isDirectory(),
    );

  console.log('');
  console.log('> Running hooks');
  console.log('');

  packages.forEach(package => {
    const pkg = JSON.parse(readPackageJson(package));

    if (!pkg['package-hooks']) {
      return;
    }

    const hooks = pkg['package-hooks'];

    if (hooks[type]) {
      const fn = eval(
        fs.readFileSync(
          path.resolve(__dirname, '../packages', package, hooks[type]),
          {encoding: 'utf-8'},
        ),
      );
      fn(name, version, helpers);
    }
  });
}

/**
 * Get the current version of a {name} package
 * @param {string} name of package
 */
function getVersionOfPackage(name) {
  return JSON.parse(readPackageJson(name)).version;
}

/**
 * Reads {name} package.json (as string)
 * @param {string} name of package
 */
function readPackageJson(name) {
  return fs.readFileSync(
    path.resolve(__dirname, '../packages', name, 'package.json'),
    {
      encoding: 'utf-8',
    },
  );
}

/**
 * Writes new package.json
 * @param {string} name of package
 * @param {string} data new package.json
 */
function writePackageJson(name, data) {
  fs.writeFileSync(
    path.resolve(__dirname, '../packages', name, 'package.json'),
    data,
    {
      encoding: 'utf-8',
    },
  );
}

/**
 * Bump dependency of {name} in {source} package.json
 * @param {string} source name of a package where change happens
 * @param {string} name of package that has changed
 * @param {string} version of package
 */
function bumpPackage(source, name, version) {
  console.log(`[${source}] bumping ${name}`);

  // "apollo-angular": "~1.4.0"
  const findPackage = new RegExp(`"${name}": "\\~[^"]+"`);
  const pkg = readPackageJson(source);

  writePackageJson(
    source,
    pkg.replace(findPackage, `"${name}": "~${version}"`),
  );

  if (
    JSON.parse(readPackageJson(source)).dependencies[name] !== `~${version}`
  ) {
    throw new Error(`Bumping ${name} failed in ${source}`);
  }
}

/**
 * Compares dependency of {name} in {source} package.json
 * @param {string} source name of a package that contains a dependency
 * @param {string} name of package
 */
function compare(source, name) {
  const inSource = JSON.parse(readPackageJson(source)).dependencies[name];
  const inPackage = JSON.parse(readPackageJson(name)).version;

  if (!semver.satisfies(inPackage, inSource)) {
    throw new Error(
      `Version ${inPackage} of ${name} does not satisfy the range ${inSource} in ${source}`,
    );
  }
}

const helpers = {
  readPackageJson,
  writePackageJson,
  getVersionOfPackage,
  bumpPackage,
  compare,
};

program.parse(process.argv);
