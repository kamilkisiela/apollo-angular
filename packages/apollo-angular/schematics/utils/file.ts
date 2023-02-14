import * as ts from 'typescript';
import { Tree, SchematicsException } from '@angular-devkit/schematics';

export function getFileContent(host: Tree, path: string): string {
  const buffer = host.read(path);

  if (buffer === null) {
    throw new SchematicsException(`Couldn't read ${path}!`);
  }

  return buffer.toString('utf-8');
}

export function parseJSON(path: string, content: string) {
  const { config, error } = ts.readConfigFile(path, () => content);

  if (error) {
    throw new SchematicsException(error.messageText.toString());
  }

  return config;
}

/**
 * Returns the parsed content of a json file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 */
export function getJsonFile(host: Tree, path: string) {
  return parseJSON(path, getFileContent(host, path));
}

/**
 * Reads file from given path and Returns TypeScript source file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 * */
export function getTypeScriptSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find ${path}!`);
  }

  const content = buffer.toString();
  const sourceFile = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return sourceFile;
}
