import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { dirname, resolve, sep } from 'path';
import recursive from 'recursive-readdir';
import replaceExt from 'replace-ext';
import sortPaths from 'sort-paths';
import { ToolsConfig } from './tools-config.service';

@Injectable()
export class ToolsService {
  private logger: Logger;

  setLogger(command: string): void {
    this.logger = getLogger(`${ToolsService.name}: ${command}`);
    this.logger.level = 'all';
  }

  versionUpdaterHandler(
    workspaceFile: string,
    config: ToolsConfig['filesList']
  ): void {
    this.logger.info('Start update versions...');
    this.showConfigInfo(config);

    const rootConfigPath = resolve('package.json');
    const projects = this.getProjects(workspaceFile);

    Object.keys(projects)
      .filter((key) => !key.includes('-e2e'))
      .forEach((projectName) => {
        this.logger.debug(
          `Process project "${projectName}" in ${projects[projectName].root}`
        );
        this.updateFolderPackageFromRootPackage(
          rootConfigPath,
          `${projects[projectName].root}/package.json`
        );
      });
    this.logger.info('End of update versions...');
  }

  private showConfigInfo(config: {
    indexFileName: string;
    excludes: string[];
  }) {
    if (config) {
      this.logger.debug(`Config: ${JSON.stringify(config)}`);
    }
  }

  private updateFolderPackageFromRootPackage(
    rootConfigPath: string,
    appConfigPath: string
  ) {
    this.logger.info(
      `Start for ${JSON.stringify({
        rootConfigPath: rootConfigPath,
        appConfigPath: appConfigPath,
      })}`
    );
    if (appConfigPath === rootConfigPath) {
      throw new Error(
        `Source and destination is equals: ${appConfigPath}==${rootConfigPath}`
      );
    }
    let folderConfig: unknown;
    let rootConfig: unknown;
    let content: string;

    try {
      content = readFileSync(rootConfigPath).toString();
      rootConfig = JSON.parse(content);
    } catch (error) {
      throw new Error(`Wrong body of file ${rootConfigPath}`);
    }
    try {
      content = readFileSync(appConfigPath).toString();
      folderConfig = JSON.parse(content);
      folderConfig['version'] = rootConfig['version'];
      if (folderConfig['peerDependencies']) {
        const peerDependenciesKeys = Object.keys(
          folderConfig['peerDependencies']
        );
        peerDependenciesKeys.forEach((key) => {
          if (rootConfig['dependencies'][key]) {
            folderConfig['peerDependencies'][key] =
              rootConfig['dependencies'][key];
          }
        });
      }
      if (folderConfig['dependencies']) {
        const dependenciesKeys = Object.keys(folderConfig['dependencies']);
        dependenciesKeys.forEach((key) => {
          if (rootConfig['dependencies'][key]) {
            folderConfig['dependencies'][key] = rootConfig['dependencies'][key];
          }
          if (rootConfig['devDependencies'][key]) {
            folderConfig['dependencies'][key] =
              rootConfig['devDependencies'][key];
          }
        });
      }
      writeFileSync(appConfigPath, JSON.stringify(folderConfig, null, 4));
    } catch (error) {
      this.logger.info('Error', `Wrong body of file ${appConfigPath}`);
    }
    this.logger.info(
      `End of for ${JSON.stringify({
        rootConfigPath: rootConfigPath,
        appConfigPath: appConfigPath,
      })}`
    );
  }

  makeTsListHandler(
    workspaceFile: string,
    config: ToolsConfig['filesList']
  ): void {
    this.logger.info('Start create list files...');
    this.showConfigInfo(config);

    const indexFileName = config.indexFileName;
    const excludes = config.excludes;
    const projects = this.getProjects(workspaceFile);

    Object.keys(projects)
      .filter((projectName) => projects[projectName].projectType === 'library')
      .filter((key) => !key.includes('-e2e'))
      .forEach((projectName) => {
        this.logger.debug(
          `Process library "${projectName}" in ${projects[projectName].sourceRoot}`
        );
        this.processLibrary(
          projects[projectName].sourceRoot,
          indexFileName,
          excludes
        );
      });
    this.logger.info('End of create list files...');
  }

  private processLibrary(
    path: string,
    indexFileName: string,
    excludes: string[]
  ): void {
    const indexFilePath = resolve(path, `${indexFileName}.ts`);
    const newExcludes = ['!*.ts*', ...excludes, indexFilePath];
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    recursive(path, newExcludes, (err, files) => {
      if (err || !Array.isArray(files)) {
        throw err;
      }
      files = sortPaths(files, sep);
      const list: string[] = [];
      files.forEach((file: string) => {
        let localFile = replaceExt(
          file.replace(path, '').replace(new RegExp(`\\${sep}`, 'g'), '/'),
          ''
        )
          .split(sep)
          .join('/');
        if (localFile && localFile[0] === '/') {
          localFile = `.${localFile}`;
        }
        if (localFile !== `./${indexFileName}`) {
          list.push(`export * from '${localFile}';`);
        }
      });
      const body = `${list.join('\n')}\n`;
      if (list.join('').length > 0) {
        if (!existsSync(dirname(indexFilePath))) {
          mkdirSync(dirname(indexFilePath), { recursive: true });
        }
        writeFileSync(indexFilePath, body);
      }
    });
  }

  private getProjects(workspaceFile: string) {
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
