import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";

import { getMainPath, getTypeScriptSourceFile } from ".";

/**
 * Import and add module to the root module. 
 * @param host {Tree} The source tree.
 * @param importedModuleName {String} The name of the imported module.
 * @param importedModulePath {String} The location of the imported module.
 * @param projectName {String} The name of the project.
 */
export function addModuleImportToRootModule(
  host: Tree,
  importedModuleName: string,
  importedModulePath: string,
  projectName?: string,
) {

  const mainPath = getMainPath(host, projectName);
  const appModulePath = getAppModulePath(host, mainPath);
  addModuleImportToModule(host, appModulePath, importedModuleName, importedModulePath);
}

/**
 * Import and add module to specific module path.
 * @param host {Tree} The source tree.
 * @param moduleToImportIn {String} The location of the module to import in.
 * @param importedModuleName {String} The name of the imported module.
 * @param importedModulePath {String} The location of the imported module.
 */
function addModuleImportToModule(
  host: Tree, moduleToImportIn: string, importedModuleName: string, importedModulePath: string) {
  const moduleSource = getTypeScriptSourceFile(host, moduleToImportIn);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${moduleToImportIn}`);
  }

  const changes = addImportToModule(moduleSource, moduleToImportIn, importedModuleName, importedModulePath);
  const recorder = host.beginUpdate(moduleToImportIn);

  changes
    .filter((change: Change) => change instanceof InsertChange)
    .forEach((change: InsertChange) => recorder.insertLeft(change.pos, change.toAdd));

  host.commitUpdate(recorder);
}