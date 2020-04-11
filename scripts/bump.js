#!/usr/bin/env node

/// @ts-check
const fs = require('fs');
const globby = require('globby');
const {resolve} = require('path');
const {execSync} = require('child_process');

async function main() {
  const rootPkg = readJSON(resolve(__dirname, '../package.json'));
  const packageDirs = await globby(rootPkg.workspaces, {
    cwd: process.cwd(),
    onlyDirectories: true,
  });

  packageDirs.forEach(bumpAlha);
}

/**
 * @param {string} packageDir
 */
function bumpAlha(packageDir) {
  const filepath = resolve(packageDir, 'package.json');
  const pkg = readJSON(filepath);

  const name = pkg.name;
  const version = pkg.version.replace(/-alpha\.(\d+)/, (_, ver) => {
    return `-alpha.${parseInt(ver, 10) + 1}`;
  });

  execSync(`./scripts/version.js ${name} ${version}`, {
    stdio: 'inherit',
  });
}

/**
 * @param {string} filepath
 */
function readFile(filepath) {
  return fs.readFileSync(resolve(__dirname, filepath), {
    encoding: 'utf-8',
  });
}

/**
 * @param {string} filepath
 */
function readJSON(filepath) {
  return JSON.parse(readFile(filepath));
}

main();
