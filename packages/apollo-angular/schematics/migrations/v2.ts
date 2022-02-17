import {
  Rule,
  Tree,
  chain,
  SchematicContext,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import * as ts from 'typescript';
import {getJsonFile} from '../utils';
import {createDependenciesMap} from '../install/index';

export default function (): Rule {
  return chain([migrateImports, migrateTsConfig, migrateDependencies]);
}

function migrateDependencies() {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const packageJson = getJsonFile(tree, packageJsonPath);

    packageJson.dependencies = packageJson.dependencies || {};

    const dependenciesMap = createDependenciesMap({});

    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];

        packageJson.dependencies[dependency] = version;
      }
    }

    const packagesToRemove = [
      'graphql-tag',
      'apollo-client',
      'apollo-cache',
      'apollo-cache-inmemory',
      'apollo-utilities',
      'apollo-link',
      'apollo-link-http',
      'apollo-link-batch-http',
      'apollo-link-context',
      'apollo-link-error',
      'apollo-link-schema',
      'apollo-link-ws',
      'apollo-angular-link-http',
      'apollo-angular-link-http-batch',
      'apollo-angular-link-headers',
    ];

    const removedPackages: string[] = [];

    packagesToRemove.forEach((packageName) => {
      let removed = false;

      if (packageJson.dependencies?.[packageName]) {
        delete packageJson.dependencies[packageName];
        removed = true;
      }

      if (packageJson.devDependencies?.[packageName]) {
        delete packageJson.devDependencies[packageName];
        removed = true;
      }

      if (removed) {
        removedPackages.push(packageName);
      }
    });

    removedPackages.forEach((packageName) => {
      context.logger.info(`Removed ${packageName} dependency`);
    });

    // save the changed file
    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // schedule `npm install`
    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}

export async function migrateTsConfig(tree: Tree) {
  const tsconfigPath = 'tsconfig.json';
  const tsconfig = getJsonFile(tree, tsconfigPath);
  const compilerOptions: ts.CompilerOptions = tsconfig.compilerOptions;

  if (compilerOptions) {
    compilerOptions.allowSyntheticDefaultImports = true;
    tree.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  } else {
    const tsconfigBasePath = 'tsconfig.base.json';
    const tsconfigBase = getJsonFile(tree, tsconfigBasePath);
    const baseCompilerOptions: ts.CompilerOptions =
      tsconfigBase.compilerOptions;

    if (baseCompilerOptions) {
      baseCompilerOptions.allowSyntheticDefaultImports = true;
      tree.overwrite(tsconfigBasePath, JSON.stringify(tsconfigBase, null, 2));
    }
  }
}

function getIdentifiers(
  namedBindings: ts.NamedImportBindings,
  onIdentifier: (event: {name: string; alias?: string}) => void,
) {
  namedBindings.forEachChild((named) => {
    if (ts.isImportSpecifier(named)) {
      const name =
        named.propertyName && typeof named.propertyName !== 'undefined'
          ? named.propertyName.escapedText.toString()
          : named.name.escapedText.toString();

      onIdentifier({
        name,
        alias: name === named.name.escapedText.toString() ? undefined : name,
      });
    }
  });
}

export async function migrateImports(tree: Tree) {
  tree.visit((path) => {
    if (path.includes('node_modules') || !path.endsWith('.ts')) {
      return;
    }

    const importsMap: Record<
      string,
      Array<{
        name: string;
        alias?: string;
      }>
    > = {};

    function collectIdentifiers(
      packageName: string,
      namedBindings: ts.NamedImportBindings,
    ) {
      getIdentifiers(namedBindings, ({name, alias}) => {
        if (!importsMap[packageName]) {
          importsMap[packageName] = [];
        }

        importsMap[packageName].push({
          name,
          alias,
        });
      });
    }

    function redirectImport({
      source,
      target,
      modulePath,
      statement,
      recorder,
    }: {
      source: string;
      target: string;
      modulePath: string;
      statement: any;
      recorder: UpdateRecorder;
    }) {
      if (modulePath === source) {
        if (statement.importClause.namedBindings) {
          collectIdentifiers(target, statement.importClause.namedBindings);
        }

        recorder.remove(statement.getStart(), statement.getWidth());
      }
    }

    function redirectDefaultImport({
      identifier,
      source,
      target,
      modulePath,
      statement,
      recorder,
    }: {
      identifier: string;
      source: string;
      target: string;
      modulePath: string;
      statement: any;
      recorder: UpdateRecorder;
    }) {
      if (modulePath === source && statement.importClause.name) {
        if (!importsMap[target]) {
          importsMap[target] = [];
        }

        const alias = statement.importClause.name.escapedText.toString();

        importsMap[target].push({
          name: identifier,
          alias: alias !== identifier ? alias : undefined,
        });

        recorder.remove(statement.getStart(), statement.getWidth());
      }
    }

    const sourceFile = ts.createSourceFile(
      path,
      tree.read(path).toString(),
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);

    sourceFile.statements.forEach((statement) => {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier)
      ) {
        const nodeText = statement.moduleSpecifier.getText(sourceFile);
        const modulePath = statement.moduleSpecifier
          .getText(sourceFile)
          .substr(1, nodeText.length - 2);

        redirectImport({
          source: 'apollo-cache-inmemory',
          target: '@apollo/client/core',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-client',
          target: '@apollo/client/core',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link',
          target: '@apollo/client/core',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-cache',
          target: '@apollo/client/core',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-angular-link-http',
          target: 'apollo-angular/http',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-angular-link-http-batch',
          target: 'apollo-angular/http',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-utilities',
          target: '@apollo/client/utilities',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-http',
          target: '@apollo/client/link/http',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-batch-http',
          target: '@apollo/client/link/batch-http',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-context',
          target: '@apollo/client/link/context',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-error',
          target: '@apollo/client/link/error',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-schema',
          target: '@apollo/client/link/schema',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-link-ws',
          target: '@apollo/client/link/ws',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-angular',
          target: 'apollo-angular',
          recorder,
          statement,
          modulePath,
        });

        redirectImport({
          source: 'apollo-angular-link-headers',
          target: 'apollo-angular/headers',
          recorder,
          statement,
          modulePath,
        });

        redirectDefaultImport({
          identifier: 'ApolloClient',
          source: 'apollo-client',
          target: '@apollo/client/core',
          recorder,
          statement,
          modulePath,
        });

        redirectDefaultImport({
          identifier: 'gql',
          source: 'graphql-tag',
          target: 'apollo-angular',
          recorder,
          statement,
          modulePath,
        });
      }
    });

    const importSources = Object.keys(importsMap);

    importSources.forEach((importSource) => {
      const props = importsMap[importSource]
        .filter((im, i, all) => {
          if (im.alias) {
            return all.findIndex((f) => f.alias === im.alias) === i;
          }

          return all.findIndex((f) => f.name === im.name) === i;
        })
        .map((im) => (im.alias ? `${im.name} as ${im.alias}` : im.name))
        .join(', ');
      recorder.insertLeft(
        sourceFile.getStart(),
        `import {${props}} from '${importSource}';\n`,
      );
    });

    if (importSources.length) {
      tree.commitUpdate(recorder);
    }
  });
}
