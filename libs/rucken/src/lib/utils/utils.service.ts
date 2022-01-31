import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import mergeWith from 'lodash.mergewith';

@Injectable()
export class UtilsService {
  getWorkspaceProjects(workspaceFile?: string) {
    if (!workspaceFile) {
      workspaceFile = 'workspace.json';
    }
    const workspaceJson = JSON.parse(readFileSync(workspaceFile).toString());
    return Object.keys(workspaceJson.projects)
      .map((projectName) =>
        typeof workspaceJson.projects[projectName] === 'string'
          ? {
              [projectName]: JSON.parse(
                readFileSync(
                  `${workspaceJson.projects[projectName]}/project.json`
                ).toString()
              ),
            }
          : { [projectName]: workspaceJson.projects[projectName] }
      )
      .reduce((all, cur) => ({ ...all, ...cur }), {});
  }

  getRuckenConfig<T>(defaultValue: T, configFile?: string): T {
    if (!configFile) {
      configFile = 'rucken.json';
    }
    if (!existsSync(configFile)) {
      return defaultValue;
    }
    try {
      const config = JSON.parse(readFileSync(configFile).toString());
      return mergeWith(defaultValue, config);
    } catch (error) {
      return defaultValue;
    }
  }
}