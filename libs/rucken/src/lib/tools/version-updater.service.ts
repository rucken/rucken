import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { PACKAGE_JSON, UtilsService } from '../utils/utils.service';

@Injectable()
export class VersionUpdaterService {
  public static title = 'version-updater';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  versionUpdaterHandler({
    updatePackageVersion,
  }: {
    updatePackageVersion: boolean;
  }): void {
    this.logger.info('Start update versions...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        updatePackageVersion,
      })}`
    );

    const rootConfigPath = this.utilsService.resolveFilePath(PACKAGE_JSON);
    const projects = this.utilsService.getWorkspaceProjects();

    Object.keys(projects)
      .filter((key) => !key.includes('-e2e'))
      .forEach((projectName) => {
        this.logger.debug(
          `Process project "${projectName}" in ${projects[projectName].root}`
        );
        this.updateFolderPackageFromRootPackage({
          rootConfigPath,
          appConfigPath: `${projects[projectName].root}/package.json`,
          updatePackageVersion,
        });
      });
    this.logger.info('End of update versions...');
  }

  private updateFolderPackageFromRootPackage({
    rootConfigPath,
    appConfigPath,
    updatePackageVersion,
  }: {
    rootConfigPath: string;
    appConfigPath: string;
    updatePackageVersion: boolean;
  }) {
    this.logger.debug(
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
      if (updatePackageVersion) {
        folderConfig['version'] = rootConfig['version'];
      }
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
}
