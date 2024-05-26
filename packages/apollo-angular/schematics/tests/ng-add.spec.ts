const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { CompilerOptions } from 'typescript';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createDependenciesMap } from '../install';
import { getFileContent, getJsonFile, runNgAdd } from '../utils';

describe('ng-add with module', () => {
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await runNgAdd(false);
  });

  test('should update package.json dependencies', async () => {
    const packageJsonPath = '/package.json';
    expect(tree.files).toContain(packageJsonPath);

    const packageJson = getJsonFile(tree, packageJsonPath);
    const { dependencies } = packageJson;

    const dependenciesMap = createDependenciesMap({
      project: 'my-project',
      graphql: '16',
    });

    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];

        expect(dependencies[dependency]).toBe(version);
      }
    }
  });

  test('should add NgModule with GraphQL setup', async () => {
    const modulePath = '/projects/apollo/src/app/graphql.module.ts';
    expect(tree.files).toContain(modulePath);

    const content = getFileContent(tree, modulePath);
    expect(content).toMatch('export class GraphQLModule');
  });

  test('should import the NgModule with GraphQL setup to the root module', async () => {
    const content = getFileContent(tree, '/projects/apollo/src/app/app.module.ts');
    expect(content).toMatch(/import { GraphQLModule } from '.\/graphql.module'/);
  });

  test('should import HttpClientModule to the root module', async () => {
    const content = getFileContent(tree, '/projects/apollo/src/app/app.module.ts');

    expect(content).toMatch(/import { HttpClientModule } from '@angular\/common\/http'/);
  });

  test('should add esnext.asynciterable to tsconfig.json', async () => {
    const config = getJsonFile(tree, '/tsconfig.json');
    const compilerOptions: CompilerOptions = config.compilerOptions;

    expect(compilerOptions.lib).toContain('esnext.asynciterable');
  });
});

describe('ng-add with standalone', () => {
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await runNgAdd(true);
  });

  test('should update package.json dependencies', async () => {
    const packageJsonPath = '/package.json';
    expect(tree.files).toContain(packageJsonPath);

    const packageJson = getJsonFile(tree, packageJsonPath);
    const { dependencies } = packageJson;

    const dependenciesMap = createDependenciesMap({
      project: 'my-project',
      graphql: '16',
    });

    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];

        expect(dependencies[dependency]).toBe(version);
      }
    }
  });

  test('should add graphqlProviders with GraphQL setup', async () => {
    const providerPath = '/projects/apollo/src/app/graphql.provider.ts';
    expect(tree.files).toContain(providerPath);

    const content = getFileContent(tree, providerPath);
    expect(content).toMatch('export const graphqlProvider');
  });

  test('should import the NgModule with GraphQL setup to the root module', async () => {
    const content = getFileContent(tree, '/projects/apollo/src/app/app.config.ts');

    expect(content).toMatch(/import { graphqlProvider } from '.\/graphql.provider'/);
  });

  test('should import HttpClientModule to the root module', async () => {
    const content = getFileContent(tree, '/projects/apollo/src/app/app.config.ts');

    expect(content).toMatch(/import { provideHttpClient } from '@angular\/common\/http'/);
  });

  test('should add esnext.asynciterable to tsconfig.json', async () => {
    const config = getJsonFile(tree, '/tsconfig.json');
    const compilerOptions: CompilerOptions = config.compilerOptions;

    expect(compilerOptions.lib).toContain('esnext.asynciterable');
  });
});
