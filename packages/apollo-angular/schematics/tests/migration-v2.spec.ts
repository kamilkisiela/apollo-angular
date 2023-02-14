import { resolve } from 'path';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { CompilerOptions } from 'typescript';

import { createTestApp, getJsonFile, parseJSON } from '../utils';
import { createDependenciesMap } from '../install';

const migrationsPath = resolve(__dirname, '../migrations.json');
const migrationName = 'migration-2.0.0';

describe('Migration: Apollo Angular V2', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(async () => {
    appTree = await createTestApp();
    runner = new SchematicTestRunner('schematics', migrationsPath);
  });

  test('should update imports', async () => {
    appTree.create(
      'file.ts',
      `
        import { InMemoryCache } from 'apollo-cache-inmemory';
        import { ApolloClient } from 'apollo-client';
        import { ApolloLink } from 'apollo-link';
        import { onError } from 'apollo-link-error';
        import ApolloClient from 'apollo-client';
        import { HttpLink } from 'apollo-angular-link-http';
        import { Apollo } from 'apollo-angular';
        import gql from 'graphql-tag';
      `
    );
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();
    const file = tree.readContent('file.ts').trim();

    expect(file).toContain(`import {InMemoryCache, ApolloClient, ApolloLink} from '@apollo/client/core';`);
    expect(file).toContain(`import {onError} from '@apollo/client/link/error';`);
    expect(file).toContain(`import {HttpLink} from 'apollo-angular/http';`);
    expect(file).toContain(`import {Apollo, gql} from 'apollo-angular';`);
  });

  test('should update imports (with aliases)', async () => {
    appTree.create(
      'file.ts',
      `
        import { InMemoryCache } from 'apollo-cache-inmemory';
        import { ApolloClient } from 'apollo-client';
        import { ApolloLink } from 'apollo-link';
        import { onError } from 'apollo-link-error';
        import ApolloClient from 'apollo-client';
        import { HttpLink } from 'apollo-angular-link-http';
        import { Apollo } from 'apollo-angular';
        import graphql from 'graphql-tag';
      `
    );
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();

    const file = tree.readContent('file.ts').trim();

    expect(file).toContain(`import {InMemoryCache, ApolloClient, ApolloLink} from '@apollo/client/core';`);
    expect(file).toContain(`import {onError} from '@apollo/client/link/error';`);
    expect(file).toContain(`import {HttpLink} from 'apollo-angular/http';`);
    expect(file).toContain(`import {Apollo, gql as graphql} from 'apollo-angular';`);
  });

  test('should keep existing imports', async () => {
    appTree.create(
      'file.ts',
      `
      import { Injectable } from '@angular/core'
      import { Observable, empty } from 'rxjs'
      import { map, catchError } from 'rxjs/operators'
      import { Apollo, ApolloBase } from 'apollo-angular'
      import { ApolloError } from '@apollo/client/core'
      import { HttpLink } from 'apollo-angular-link-http'
    `
    );
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();

    const file = tree.readContent('file.ts').trim();

    expect(file).toMatch(/^\s*import { Injectable } from '@angular\/core'/m);
    expect(file).toMatch(/^\s*import { Observable, empty } from 'rxjs'/m);
    expect(file).toMatch(/^\s*import { map, catchError } from 'rxjs\/operators'/m);
    expect(file).toMatch(/^\s*import {Apollo, ApolloBase} from 'apollo-angular'/m);
    expect(file).toMatch(/^\s*import {HttpLink} from 'apollo-angular\/http'/m);
    expect(file).toMatch(/^\s*import { ApolloError } from '@apollo\/client\/core'/m);
  });

  test('should migrate apollo-client default export', async () => {
    appTree.create(
      'file.ts',
      `
        import ApolloClient from 'apollo-client';
      `
    );
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();
    const file = tree.readContent('file.ts').trim();

    expect(file).toContain(`import {ApolloClient} from '@apollo/client/core';`);
  });

  test('should update imports without leaking to other files', async () => {
    appTree.create(
      'file1.ts',
      `
        import { ApolloClient } from 'apollo-client';
        import { ApolloLink } from 'apollo-link';
      `
    );

    appTree.create(
      'file2.ts',
      `
        import { InMemoryCache } from 'apollo-cache-inmemory';
        import { ApolloClient } from 'apollo-client';
      `
    );
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();

    const file1 = tree.readContent('file1.ts').trim();
    const file2 = tree.readContent('file2.ts').trim();

    expect(file1).toContain(`import {ApolloClient, ApolloLink} from '@apollo/client/core';`);
    expect(file2).toContain(`import {InMemoryCache, ApolloClient} from '@apollo/client/core';`);
  });

  test('should enable allowSyntheticDefaultImports in tsconfig.json', async () => {
    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();
    const rootModulePath = '/tsconfig.json';
    const compilerOptions: CompilerOptions = getJsonFile(tree, rootModulePath).compilerOptions;

    expect(compilerOptions.allowSyntheticDefaultImports).toEqual(true);
  });

  test('should update package.json', async () => {
    const oldPackageJson = parseJSON('package.json', appTree.read('package.json').toString('utf-8'));

    oldPackageJson.dependencies = {
      ...oldPackageJson.dependencies,
      'apollo-angular': '^1.8.0',
      'apollo-angular-link-http': '^1.9.0',
      'apollo-link': '^1.2.11',
      'apollo-client': '^2.6.0',
      'apollo-cache-inmemory': '^1.6.0',
      'graphql-tag': '^2.10.0',
      graphql: '^14.5.0',
    };

    appTree.overwrite('package.json', JSON.stringify(oldPackageJson, null, 2));

    const tree = await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();

    const packageJson = parseJSON('package.json', tree.readContent('package.json'));

    const dependenciesMap = createDependenciesMap({});

    expect(packageJson.dependencies['apollo-angular']).toEqual(dependenciesMap['apollo-angular']);
    expect(packageJson.dependencies['@apollo/client']).toEqual(dependenciesMap['@apollo/client']);

    expect(packageJson.dependencies['apollo-angular-link-http']).toBeUndefined();
    expect(packageJson.dependencies['apollo-client']).toBeUndefined();
    expect(packageJson.dependencies['apollo-link']).toBeUndefined();
    expect(packageJson.dependencies['apollo-cache-inmemory']).toBeUndefined();
    expect(packageJson.dependencies['graphql-tag']).toBeUndefined();
  });
});
