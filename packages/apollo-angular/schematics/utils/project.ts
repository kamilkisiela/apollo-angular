import { Tree, SchematicsException } from "@angular-devkit/schematics";

import { getJsonFile } from ".";

export function getMainPath(host: Tree, name?: string) {
    const project = getProject(host, name);
    return project.architect.build.options.main;
}

function getProject(host: Tree, name?: string) {
    const config = getWorkspaceConfig(host);
    if (name) {
        const project = config.projects[name];
        if (!project) {
            throw new SchematicsException(`Couldn't file project ${name}`);
        }

        return config.projects[name];
    }

    const projectNames = Object.keys(config.projects);
    if (projectNames.length === 0) {
        throw new SchematicsException(`Invalid configuration object! No project found!`);
    }

    if (projectNames.length > 1) {
        const { defaultProject } = config;
        return config.projects[defaultProject];
    }

    const projectName = projectNames[0];
    return config.projects[projectName];
}

function getWorkspaceConfig(host: Tree): any {
    const path = getWorkspacePath(host);
    const config = getJsonFile(host, path);

    return config;
}

function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.find(path => host.exists(path));

  if (!path) {
      throw new SchematicsException(`Couldn't find Angular configuration file! ` +
        `Execute in a project, created with Angular CLI ^6.0.`
    );
  }

  return path;
}
