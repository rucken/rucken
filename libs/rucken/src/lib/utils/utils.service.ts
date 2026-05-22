import { Injectable } from '@nestjs/common';
import { kebabCase } from 'case-anything';
import { existsSync, readFileSync } from 'fs';
import { globSync } from 'glob';
// @ts-expect-error - No type definitions available for lodash.mergewith
import mergeWith from 'lodash.mergewith';
import { getLogger, Logger } from 'log4js';
import { join, resolve } from 'path';

export const WORKSPACE_JSON = 'workspace.json';
export const TSCONFIG_BASE_JSON = 'tsconfig.base.json';
export const TSCONFIG_JSON = 'tsconfig.json';
export const PROJECT_JSON = 'project.json';
export const PACKAGE_JSON = 'package.json';
export const RUCKEN_JSON = 'rucken.json';
export const TRANSLOCO_CONFIG_JSON = 'transloco.config.json';
export const TRANSLOCO_CONFIG_JS = 'transloco.config.js';

export interface WorkspaceProject {
  root?: string;
  sourceRoot?: string;
  projectType?: string;
  [key: string]: unknown;
}

export interface WorkspaceConfig {
  projects: Record<string, WorkspaceProject | string>;
}

@Injectable()
export class UtilsService {
  private logger: Logger;

  public static logLevel = (): string =>
    (process.env['DEBUG'] === '*'
      ? 'all'
      : process.env['RUCKEN_LOG_LEVEL'] || process.env['DEBUG']) || 'info';

  constructor() {
    this.logger = getLogger(UtilsService.name);
    this.logger.level = UtilsService.logLevel();
  }

  getLogger(): Logger {
    return this.logger;
  }

  resolveFilePath(filename: string, dirname?: string): string {
    if (!dirname && existsSync(filename)) {
      return resolve(filename);
    }
    if (!dirname && existsSync(join(process.cwd(), filename))) {
      return resolve(join(process.cwd(), filename));
    }
    if (dirname && existsSync(join(dirname, filename))) {
      return resolve(join(dirname, filename));
    }

    return dirname ? resolve(join(dirname, filename)) : resolve(filename);
  }

  getWorkspaceProjects(
    workspaceFile?: string,
  ): Record<string, WorkspaceProject> {
    let workspaceJson: WorkspaceConfig;
    const resolvedWorkspaceFile = workspaceFile
      ? this.resolveFilePath(workspaceFile)
      : this.resolveFilePath(WORKSPACE_JSON);

    if (existsSync(resolvedWorkspaceFile)) {
      workspaceJson = JSON.parse(
        readFileSync(resolvedWorkspaceFile).toString(),
      ) as WorkspaceConfig;
    } else {
      const tsconfigBaseJson = this.resolveFilePath(TSCONFIG_BASE_JSON);
      if (existsSync(tsconfigBaseJson)) {
        const projects = this.collectProjectsFromTsConfig(tsconfigBaseJson);
        workspaceJson = { projects };
      } else {
        const tsconfigJson = this.resolveFilePath(TSCONFIG_JSON);
        if (existsSync(tsconfigJson)) {
          const projects = this.collectProjectsFromTsConfig(tsconfigJson);
          workspaceJson = { projects };
        } else {
          workspaceJson = { projects: {} };
        }
      }
    }

    const projectFiles = globSync(`./**/**/${PROJECT_JSON}`);
    const projectsFromFiles: Record<string, WorkspaceProject> = {};

    for (const projectFile of projectFiles) {
      const project = JSON.parse(
        readFileSync(projectFile).toString(),
      ) as WorkspaceProject;
      if (
        project.name &&
        project.sourceRoot &&
        typeof project.name === 'string'
      ) {
        projectsFromFiles[project.name] = project;
      }
    }

    const ruckenConfig = this.getRuckenConfig<WorkspaceConfig>({
      projects: {},
    });

    const mergedWorkspace: WorkspaceConfig = {
      projects: {
        ...(workspaceJson?.projects || {}),
        ...(ruckenConfig?.projects || {}),
        ...(projectsFromFiles || {}),
      },
    };

    return Object.entries(mergedWorkspace.projects).reduce<
      Record<string, WorkspaceProject>
    >((acc, [projectName, projectData]) => {
      let project: WorkspaceProject;
      try {
        project =
          typeof projectData === 'string'
            ? JSON.parse(readFileSync(`${projectData}/project.json`).toString())
            : { ...projectData };
      } catch (_err) {
        project = {
          root:
            typeof projectData === 'string' ? projectData : projectData.root,
        };
      }

      project.root =
        project.root ||
        (project.sourceRoot || '')
          .split('/')
          .filter((_, i, arr) => i < arr.length - 1)
          .join('/');

      acc[kebabCase(projectName)] = project;
      return acc;
    }, {});
  }

  private collectProjectsFromTsConfig(
    tsconfigFile: string,
  ): Record<string, string> {
    const json = JSON.parse(readFileSync(tsconfigFile).toString());
    const projects: Record<string, string> = {};
    const paths = json.compilerOptions?.paths || {};

    Object.entries<string[]>(paths)
      .filter(([key]) => !key.includes('*'))
      .forEach(([key, pathArray]) => {
        try {
          let path = pathArray[0].replace('/src/index.ts', '');
          const projectName = kebabCase(key);

          if (existsSync(join(path, PROJECT_JSON))) {
            projects[projectName] = path;
          } else {
            path = pathArray[0].replace('/index.ts', '');
            projects[projectName] = path;
          }
        } catch (err) {
          this.logger.error(JSON.stringify({ json, key }));
          this.logger.error((err as Error).message, (err as Error).stack);
          throw err;
        }
      });

    return projects;
  }

  getRuckenConfig<T>(defaultValue: T, configFile?: string): T {
    const resolvedConfigFile = configFile
      ? this.resolveFilePath(configFile)
      : this.resolveFilePath(RUCKEN_JSON);

    if (!existsSync(resolvedConfigFile)) {
      return defaultValue;
    }

    try {
      const config = JSON.parse(readFileSync(resolvedConfigFile).toString());
      return mergeWith({}, defaultValue, config);
    } catch (error) {
      this.logger.warn(error);
      return defaultValue;
    }
  }

  getExtractAppName(nxAppName: string): string {
    return nxAppName
      .split('-')
      .join('_')
      .replace('-server', '')
      .replace('-ms', '');
  }

  replaceEnv(
    command: string | undefined,
    envReplacerKeyPattern = '$key',
    depth = 10,
  ): string {
    if (!command) {
      return command || '';
    }

    let newCommand = command;

    for (const key of Object.keys(process.env)) {
      const envValue = process.env[key] || '';
      newCommand = newCommand
        .split('%space%')
        .join(' ')
        .split('%br%')
        .join('<br/>')
        .split(`\${${key}}`)
        .join(envValue)
        .split(envReplacerKeyPattern.replace('key', key))
        .join(envValue);
    }

    if (command !== newCommand && newCommand.includes('$') && depth > 0) {
      newCommand = this.replaceEnv(
        newCommand,
        envReplacerKeyPattern,
        depth - 1,
      );
    }

    return newCommand;
  }
}
