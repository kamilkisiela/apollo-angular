import {join} from 'path';

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

const collectionPath = join(__dirname, '../collection.json');

export async function createTestApp(appOptions = {}): Promise<UnitTestTree> {
  const baseRunner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceTree = await baseRunner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '6.0.0',
      newProjectRoot: 'projects',
    })
    .toPromise();

  return baseRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        ...appOptions,
        name: 'apollo',
      },
      workspaceTree,
    )
    .toPromise();
}
