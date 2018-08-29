import * as path from 'path';

import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';

import { createTestApp } from '../utils';

const collectionPath = path.join(__dirname, '../collection.json');

describe('Apollo Install schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTestApp();
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  it('should update package.json dependencies', () => {
    const tree = runner.runSchematic('install', {}, appTree);
    const packageJsonPath = '/package.json';
    expect(tree.files).toContain(packageJsonPath);

    const packageJson = JSON.parse(getFileContent(tree, packageJsonPath));
    const { dependencies } = packageJson;

    expect(dependencies['apollo-angular']).toBeDefined();
    expect(dependencies['apollo-angular-link-http']).toBeDefined();
    expect(dependencies['apollo-link']).toBeDefined();
    expect(dependencies['apollo-client']).toBeDefined();
    expect(dependencies['apollo-cache-inmemory']).toBeDefined();
    expect(dependencies['graphql-tag']).toBeDefined();
    expect(dependencies['graphql']).toBeDefined();
  });

  it('should add NgModule with GraphQL setup', () => {
    const tree = runner.runSchematic('install', {}, appTree);
    const modulePath = '/projects/apollo/src/app/graphql.module.ts';
    expect(tree.files).toContain(modulePath);

    const content = getFileContent(tree, modulePath);
    expect(content).toMatch('export class GraphQLModule');
  });

  it('should import the NgModule with GraphQL setup to the root module', () => {
    const tree = runner.runSchematic('install', {}, appTree);
    const rootModulePath = '/projects/apollo/src/app/app.module.ts';
    const content = getFileContent(tree, rootModulePath);

    expect(content).toMatch(/import { GraphQLModule } from '.\/graphql.module'/);
  });

  it('should import HttpClientModule to the root module', () => {
    const tree = runner.runSchematic('install', {}, appTree);
    const rootModulePath = '/projects/apollo/src/app/app.module.ts';
    const content = getFileContent(tree, rootModulePath);

    expect(content).toMatch(/import { HttpClientModule } from '@angular\/common\/http'/);
  });
});
