import { Injectable } from '@nestjs/common';
import { kebabCase } from 'case-anything';
import { existsSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import mergeWith from 'lodash.mergewith';
import { getLogger } from 'log4js';
import { join, resolve } from 'path';

export const WORKSPACE_JSON = 'workspace.json';
export const TSCONFIG_BASE_JSON = 'tsconfig.base.json';
export const TSCONFIG_JSON = 'tsconfig.json';
export const PROJECT_JSON = 'project.json';
export const PACKAGE_JSON = 'package.json';
export const RUCKEN_JSON = 'rucken.json';
export const TRANSLOCO_CONFIG_JSON = 'transloco.config.json';
export const TRANSLOCO_CONFIG_JS = 'transloco.config.js';

@Injectable()
export class UtilsService {
  public static logLevel = () =>
    (process.env['DEBUG'] === '*'
      ? 'all'
      : process.env['RUCKEN_LOG_LEVEL'] || process.env['DEBUG']) || 'info';

  getLogger() {
    const logger = getLogger(UtilsService.name);
    logger.level = UtilsService.logLevel();
    return logger;
  }

  resolveFilePath(filename: string, dirname?: string) {
    if (!dirname && existsSync(filename)) {
      return resolve(filename);
    }
    if (!dirname && existsSync(join(process.cwd(), filename))) {
      return resolve(join(process.cwd(), filename));
    }
    if (dirname && existsSync(join(dirname, filename))) {
      return resolve(join(dirname, filename));
    }

    if (dirname) {
      return resolve(join(dirname, filename));
    } else {
      return resolve(filename);
    }
  }

  getWorkspaceProjects(workspaceFile?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let workspaceJson: any;
    if (!workspaceFile) {
      workspaceFile = this.resolveFilePath(WORKSPACE_JSON);
    } else {
      workspaceFile = this.resolveFilePath(workspaceFile);
    }
    if (existsSync(workspaceFile)) {
      workspaceJson = JSON.parse(readFileSync(workspaceFile).toString());
    } else {
      const tsconfigBaseJson = this.resolveFilePath(TSCONFIG_BASE_JSON);
      if (existsSync(tsconfigBaseJson)) {
        const projects: Record<string, string> =
          this.collectProjectsFromTsConfig(tsconfigBaseJson);
        workspaceJson = { projects };
      } else {
        const tsconfigJson = this.resolveFilePath(TSCONFIG_BASE_JSON);
        if (existsSync(tsconfigJson)) {
          const projects: Record<string, string> =
            this.collectProjectsFromTsConfig(tsconfigJson);
          workspaceJson = { projects };
        }
      }
    }

    const files = globSync(`./**/**/${PROJECT_JSON}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects: any = {};

    for (let index = 0; index < files.length; index++) {
      const project = JSON.parse(readFileSync(files[index]).toString());
      if (project.name && project.sourceRoot) {
        projects[project.name] = project;
      }
    }

    const ruckenWorkspaceJson = this.getRuckenConfig({
      workspace: { projects: {} },
    });

    workspaceJson = {
      projects: {
        ...(workspaceJson?.projects || {}),
        ...(ruckenWorkspaceJson.workspace?.projects || {}),
        ...(projects || {}),
      },
    };

    return Object.keys(workspaceJson?.projects)
      .map((projectName) => {
        let project = {};
        try {
          project =
            typeof workspaceJson.projects[projectName] === 'string'
              ? {
                  [projectName]: JSON.parse(
                    readFileSync(
                      `${workspaceJson.projects[projectName]}/project.json`
                    ).toString()
                  ),
                }
              : { [projectName]: workspaceJson.projects[projectName] };
        } catch (err) {
          project = {
            [kebabCase(projectName)]: {
              root: workspaceJson.projects[projectName],
            },
          };
        }
        project[projectName].root =
          project[projectName].root ||
          (project[projectName].sourceRoot || '')
            .split('/')
            .filter((o, i, a) => i < a.length - 1)
            .join('/');
        return project;
      })
      .reduce((all, cur) => ({ ...all, ...cur }), {});
  }

  private collectProjectsFromTsConfig(tsconfigFile: string) {
    const json = JSON.parse(readFileSync(tsconfigFile).toString());
    const projects: Record<string, string> = {};
    Object.keys(json.compilerOptions.paths || {})
      .filter((key) => !key.includes('*'))
      .map((key) => {
        try {
          let path = json.compilerOptions.paths[key][0].replace(
            '/src/index.ts',
            ''
          );
          const projectName = kebabCase(key);

          if (existsSync(join(path, PROJECT_JSON))) {
            projects[projectName] = path;
          } else {
            path = (
              Array.isArray(json.compilerOptions.paths[key])
                ? json.compilerOptions.paths[key][0]
                : json.compilerOptions.paths[key]
            ).replace('/index.ts', '');
            projects[projectName] = path;
          }
        } catch (err) {
          this.getLogger().log(JSON.stringify({ json, key }));
          this.getLogger().error(err, err.stack);
          throw err;
        }
      });
    return projects;
  }

  getRuckenConfig<T>(defaultValue: T, configFile?: string): T {
    if (!configFile) {
      configFile = this.resolveFilePath(RUCKEN_JSON);
    } else {
      configFile = this.resolveFilePath(configFile);
    }
    if (!existsSync(configFile)) {
      return defaultValue;
    }
    try {
      const config = JSON.parse(readFileSync(configFile).toString());
      return mergeWith(defaultValue, config);
    } catch (error) {
      this.getLogger().warn(error);
      return defaultValue;
    }
  }

  getExtractAppName(nxAppName: string) {
    return nxAppName
      .split('-')
      .join('_')
      .replace('-server', '')
      .replace('-ms', '');
  }

  replaceEnv(
    command: string | undefined,
    envReplacerKeyPattern = '$key',
    depth = 10
  ): string {
    if (!command) {
      return command;
    }
    let newCommand = command;
    Object.keys(process.env).forEach(
      (key) =>
        (newCommand = (newCommand || '')
          .split('%space%')
          .join(' ')
          .split('%br%')
          .join('<br/>')
          .split(`\${${key}}`)
          .join(process.env[key])
          .split(envReplacerKeyPattern.replace('key', key))
          .join(process.env[key]))
    );
    if (command !== newCommand && newCommand.includes('$') && depth > 0) {
      newCommand = this.replaceEnv(
        newCommand,
        envReplacerKeyPattern,
        depth - 1
      );
    }
    return newCommand || '';
  }
}
