import { join } from 'path';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

const collectionPath = join(__dirname, '../collection.json');

async function createTestApp(appOptions = {}): Promise<UnitTestTree> {
  const runner = new SchematicTestRunner('apollo-angular', collectionPath);

  const workspaceTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
    name: 'workspace',
    version: '11.0.0',
    newProjectRoot: 'projects',
  });

  return runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      ...appOptions,
      name: 'apollo',
    },
    workspaceTree,
  );
}

export async function runNgAdd(standalone: boolean): Promise<UnitTestTree> {
  const projectName = 'apollo';
  const appTree = await createTestApp({ standalone: standalone, name: projectName });

  const runner = new SchematicTestRunner('apollo-angular', collectionPath);

  return await runner.runSchematic('ng-add', { project: projectName }, appTree);
}
