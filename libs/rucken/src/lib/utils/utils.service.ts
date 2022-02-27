import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import mergeWith from 'lodash.mergewith';
import { dirname, resolve } from 'path';

@Injectable()
export class UtilsService {
  private standaloneProjectPath: string;
  private standaloneProjectType: 'application' | 'library';

  setStandaloneProject(
    standaloneProjectPath: string,
    standaloneProjectType: 'application' | 'library'
  ) {
    this.standaloneProjectPath = standaloneProjectPath;
    this.standaloneProjectType = standaloneProjectType;
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

  getWorkspaceProjects(workspaceFile?: string): {
    [projectName: string]: {
      projectType: 'application' | 'library';
      root: string;
      sourceRoot: string;
    };
  } {
    if (this.standaloneProjectPath) {
      return {
        [dirname(this.standaloneProjectPath)]: {
          projectType: this.standaloneProjectType || 'application',
          root: resolve(process.cwd()).replace(
            resolve(this.standaloneProjectPath),
            ''
          ),
          sourceRoot: './',
        },
      };
    }
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
}
