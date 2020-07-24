import {dirname} from 'path';
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
import {tags, terminal} from '@angular-devkit/core';
import {CompilerOptions} from 'typescript';

import {getJsonFile, getMainPath} from '../utils';
import {Schema} from './schema';
import {addModuleImportToRootModule} from '../utils/ast';

export default function install(options: Schema): Rule {
  return chain([
    addDependencies(),
    inludeAsyncIterableLib,
    addSetupFiles(options),
    importSetupModule(options),
    importHttpClientModule(options),
  ]);
}

export const dependenciesMap: Record<string, string> = {
  'apollo-angular': '^2.0.0',
  '@apollo/client': '^3.0.0',
  graphql: '^15.0.0',
};

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
      const tsconfigBasePath = 'tsconfig.base.json';
      const tsconfigBase = getJsonFile(host, tsconfigBasePath);
      const baseCompilerOptions: CompilerOptions = tsconfigBase.compilerOptions;

      if (
        baseCompilerOptions &&
        baseCompilerOptions.lib &&
        !baseCompilerOptions.lib.find(lib => lib.toLowerCase() === requiredLib)
      ) {
        baseCompilerOptions.lib.push(requiredLib);
        host.overwrite(tsconfigBasePath, JSON.stringify(tsconfigBase, null, 2));
      } else {
        console.error(
          terminal.yellow(
            '\n' +
              tags.stripIndent`
                We couln't find '${requiredLib}' in the list of library files to be included in the compilation.
                It's required by '@apollo/client/core' package so please add it to your tsconfig.
              ` +
              '\n',
          ),
        );
      }
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
      template({
        endpoint: options.endpoint,
      }),
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
