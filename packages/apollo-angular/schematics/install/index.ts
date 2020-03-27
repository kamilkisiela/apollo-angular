import {dirname} from 'path';
import {satisfies} from 'semver';
import {
  apply,
  chain,
  url,
  template,
  Tree,
  Rule,
  SchematicContext,
  mergeWith,
  move,
} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import {resolve} from '@angular-devkit/core/node';
import {tags, terminal} from '@angular-devkit/core';
import {CompilerOptions} from 'typescript';

import {getJsonFile, getMainPath} from '../utils';
import {Schema} from './schema';
import {addModuleImportToRootModule} from '../utils/ast';

export default function install(options: Schema): Rule {
  return chain([
    assertTypescriptVersion(),
    addDependencies(),
    inludeAsyncIterableLib,
    addSetupFiles(options),
    importSetupModule(options),
    importHttpClientModule(options),
  ]);
}

export const dependenciesMap: Record<string, string> = {
  'apollo-angular': '^1.9.0-alpha.0',
  'apollo-angular-link-http': '^1.10.0-alpha.0',
  'apollo-link': '^1.2.11',
  'apollo-client': '^2.6.0',
  'apollo-cache-inmemory': '^1.6.0',
  'graphql-tag': '^2.10.0',
  graphql: '^14.6.0',
};

function assertTypescriptVersion() {
  return (host: Tree) => {
    const allowed = '>=2.8.0';
    let tsVersion: string;

    try {
      const resolveOptions = {
        basedir: host.root.path,
        checkGlobal: false,
        checkLocal: true,
      };
      tsVersion = require(resolve('typescript', resolveOptions)).version;
    } catch {
      console.error(
        terminal.bold(
          terminal.red(tags.stripIndents`
        Versions of typescript could not be determined.
        The most common reason for this is a broken npm install.
        Please make sure your package.json contains typescript in
        devDependencies, then delete node_modules and package-lock.json (if you have one) and
        run npm install again.
      `),
        ),
      );
      process.exit(2);

      return;
    }

    if (!satisfies(tsVersion, allowed)) {
      // First line of warning looks weird being split in two, disable tslint for it.
      console.error(
        terminal.yellow(
          '\n' +
            tags.stripIndent`
        typescript@'${allowed}' is required but ${tsVersion} was found instead.
        Using this version can result in undefined behaviour and difficult to debug problems.
        Please run the following command to install a compatible version of TypeScript.
            npm install typescript@'${allowed}'
      ` +
            '\n',
        ),
      );
    }

    return host;
  };
}

/**
 * Add all necessary node packages
 * as dependencies in the package.json
 * and installs them by running `npm install`.
 */
function addDependencies() {
  return (host: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const packageJson = getJsonFile(host, packageJsonPath);

    packageJson.dependencies = packageJson.dependencies || {};

    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];
        if (!packageJson.dependencies[dependency]) {
          packageJson.dependencies[dependency] = version;
        }
      }
    }

    // save the changed file
    host.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // schedule `npm install`
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

function inludeAsyncIterableLib() {
  return (host: Tree) => {
    const requiredLib = 'esnext.asynciterable';
    const tsconfigPath = 'tsconfig.json';
    const tsconfig = getJsonFile(host, tsconfigPath);
    const compilerOptions: CompilerOptions = tsconfig.compilerOptions;

    if (
      compilerOptions &&
      compilerOptions.lib &&
      !compilerOptions.lib.find(lib => lib.toLowerCase() === requiredLib)
    ) {
      compilerOptions.lib.push(requiredLib);
      host.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    } else {
      console.error(
        terminal.yellow(
          '\n' +
            tags.stripIndent`
              We couln't find '${requiredLib}' in the list of library files to be included in the compilation.
              It's required by 'apollo-client' package so please add it to your tsconfig.
            ` +
            '\n',
        ),
      );
    }

    return host;
  };
}

function addSetupFiles(options: Schema) {
  return (host: Tree) => {
    const mainPath = getMainPath(host, options.project);
    const appModulePath = getAppModulePath(host, mainPath);
    const appModuleDirectory = dirname(appModulePath);

    const templateSource = apply(url('./files'), [
      template({}),
      move(appModuleDirectory),
    ]);

    return mergeWith(templateSource);
  };
}

function importSetupModule(options: Schema) {
  return (host: Tree) => {
    addModuleImportToRootModule(
      host,
      'GraphQLModule',
      './graphql.module',
      options.project,
    );

    return host;
  };
}

function importHttpClientModule(options: Schema) {
  return (host: Tree) => {
    addModuleImportToRootModule(
      host,
      'HttpClientModule',
      '@angular/common/http',
      options.project,
    );
  };
}
