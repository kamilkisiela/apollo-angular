import { join } from "path";

import { SchematicTestRunner, UnitTestTree } from "@angular-devkit/schematics/testing";

const collectionPath = join(__dirname, '../collection.json');

export function createTestApp(appOptions = {}): UnitTestTree {
  const baseRunner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceTree = baseRunner.runExternalSchematic(
    '@schematics/angular',
    'workspace',
    {
      name: 'workspace',
      version: '6.0.0',
      newProjectRoot: 'projects',
    },
  );

  return baseRunner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      ...appOptions,
      name: 'apollo',
    },
    workspaceTree,
  );
}
