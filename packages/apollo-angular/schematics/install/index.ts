import { tags } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { CompilerOptions } from 'typescript';
import { getJsonFile, getMainPath } from '../utils';
import { Schema } from './schema';
import { addModuleImportToRootModule} from './../utils/ast'
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { dirname } from 'path';

export function factory(options: Schema): Rule {
  return chain([
    addDependencies(options),
    includeAsyncIterableLib(),
    allowSyntheticDefaultImports(),
    addSetupFiles(options),
    importSetupModule(options),
    importHttpClientModule(options),
  ]);
}

export function createDependenciesMap(options: Schema): Record<string, string> {
  return {
    'apollo-angular': '^4.2.0',
    '@apollo/client': '^3.0.0',
    graphql: `^${options.graphql ?? '16.0.0'}`,
  };
}

/**
 * Add all necessary node packages
 * as dependencies in the package.json
 * and installs them by running `npm install`.
 */
function addDependencies(options: Schema) {
  return (host: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const packageJson = getJsonFile(host, packageJsonPath);

    packageJson.dependencies = packageJson.dependencies || {};

    const dependenciesMap = createDependenciesMap(options);
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

function includeAsyncIterableLib() {
  const requiredLib = 'esnext.asynciterable';

  function updateFn(tsconfig: any) {
    const compilerOptions: CompilerOptions = tsconfig.compilerOptions;

    if (
      compilerOptions &&
      compilerOptions.lib &&
      !compilerOptions.lib.find(lib => lib.toLowerCase() === requiredLib)
    ) {
      compilerOptions.lib.push(requiredLib);
      return true;
    }
  }

  return (host: Tree) => {
    if (
      !updateTSConfig('tsconfig.json', host, updateFn) &&
      !updateTSConfig('tsconfig.base.json', host, updateFn)
    ) {
      console.error(
        '\n' +
          tags.stripIndent`
              We couldn't find '${requiredLib}' in the list of library files to be included in the compilation.
              It's required by '@apollo/client/core' package so please add it to your tsconfig.
            ` +
          '\n',
      );
    }

    return host;
  };
}

function updateTSConfig(
  tsconfigPath: string,
  host: Tree,
  updateFn: (tsconfig: any) => boolean,
): boolean {
  try {
    const tsconfig = getJsonFile(host, tsconfigPath);

    if (updateFn(tsconfig)) {
      host.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));

      return true;
    }
  } catch (error) {
    //
  }

  return false;
}

function allowSyntheticDefaultImports() {
  function updateFn(tsconfig: any) {
    if (
      tsconfig?.compilerOptions &&
      tsconfig?.compilerOptions?.lib &&
      !tsconfig.compilerOptions.allowSyntheticDefaultImports
    ) {
      tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
      return true;
    }
  }

  return (host: Tree) => {
    if (
      !updateTSConfig('tsconfig.json', host, updateFn) &&
      !updateTSConfig('tsconfig.base.json', host, updateFn)
    ) {
      console.error(
        '\n' +
          tags.stripIndent`
              We couldn't enable 'allowSyntheticDefaultImports' flag.
              It's required by '@apollo/client/core' package so please add it to your tsconfig.
            ` +
          '\n',
      );
    }

    return host;
  };
}

function addSetupFiles(options: Schema) {
  return (host: Tree) => {


    const mainPath = getMainPath(host, options.project);
    if (isStandaloneApp(host, mainPath)){
      const templateSource = apply(url('./files'), [
        template({
          endpoint: options.endpoint,
        }),
        move('projects/apollo/src/app'),
      ]);

      return mergeWith(templateSource);

    }else{
      const appModulePath = getAppModulePath(host, mainPath);
      const appModuleDirectory = dirname(appModulePath);
      const templateSource = apply(url('./files'), [
        template({
          endpoint: options.endpoint,
        }),
        move(appModuleDirectory),
      ]);

      return mergeWith(templateSource);
    }



  };
}

function importSetupModule(options: Schema) {
  return (host: Tree) => {
    addModuleImportToRootModule(host, 'GraphQLModule', './graphql.module', options.project);
    return host;
  };
}

function importHttpClientModule(options: Schema) {
  return (host: Tree) => {
    addModuleImportToRootModule(host, 'HttpClientModule', '@angular/common/http', options.project);
  };
}
