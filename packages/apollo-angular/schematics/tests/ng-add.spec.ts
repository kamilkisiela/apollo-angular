import {resolve} from 'path';
import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {getFileContent} from '@schematics/angular/utility/test';

import {createTestApp} from '../utils';
import {dependenciesMap} from '../install';

const collectionPath = resolve(__dirname, '../collection.json');

describe('ng-add', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTestApp();
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  test('should update package.json dependencies', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const packageJsonPath = '/package.json';
    expect(tree.files).toContain(packageJsonPath);

    const packageJson = JSON.parse(getFileContent(tree, packageJsonPath));
    const {dependencies} = packageJson;

    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];

        expect(dependencies[dependency]).toBe(version);
      }
    }
  });

  test('should add NgModule with GraphQL setup', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const modulePath = '/projects/apollo/src/app/graphql.module.ts';
    expect(tree.files).toContain(modulePath);

    const content = getFileContent(tree, modulePath);
    expect(content).toMatch('export class GraphQLModule');
  });

  test('should import the NgModule with GraphQL setup to the root module', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const rootModulePath = '/projects/apollo/src/app/app.module.ts';
    const content = getFileContent(tree, rootModulePath);

    expect(content).toMatch(
      /import { GraphQLModule } from '.\/graphql.module'/,
    );
  });

  test('should import HttpClientModule to the root module', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const rootModulePath = '/projects/apollo/src/app/app.module.ts';
    const content = getFileContent(tree, rootModulePath);

    expect(content).toMatch(
      /import { HttpClientModule } from '@angular\/common\/http'/,
    );
  });
});
