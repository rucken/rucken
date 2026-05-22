import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { PACKAGE_JSON, UtilsService } from '../utils/utils.service';

export interface PackageJson {
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: unknown;
}

@Injectable()
export class VersionUpdaterService {
  public static title = 'version-updater';

  private logger!: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  versionUpdaterHandler({
    updatePackageVersion,
    updateDependenciesVersion,
  }: {
    updatePackageVersion: boolean;
    updateDependenciesVersion: boolean;
  }): void {
    this.logger.info('Start update versions...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        updatePackageVersion,
        updateDependenciesVersion,
      })}`,
    );

    const rootConfigPath = this.utilsService.resolveFilePath(PACKAGE_JSON);
    const projects = this.utilsService.getWorkspaceProjects();

    for (const projectName of Object.keys(projects).filter(
      (key) => !key.includes('-e2e'),
    )) {
      const project = projects[projectName];
      if (project.root) {
        this.logger.debug(
          `Process project "${projectName}" in ${project.root}`,
        );
        this.updateFolderPackageFromRootPackage({
          rootConfigPath,
          appConfigPath: `${project.root}/package.json`,
          updatePackageVersion,
          updateDependenciesVersion,
        });
      }
    }

    this.logger.info('End of update versions...');
  }

  private updateFolderPackageFromRootPackage({
    rootConfigPath,
    appConfigPath,
    updatePackageVersion,
    updateDependenciesVersion,
  }: {
    rootConfigPath: string;
    appConfigPath: string;
    updatePackageVersion: boolean;
    updateDependenciesVersion: boolean;
  }): void {
    this.logger.debug(
      `Start for ${JSON.stringify({
        rootConfigPath,
        appConfigPath,
      })}`,
    );

    if (appConfigPath === rootConfigPath) {
      throw new Error(
        `Source and destination are equal: ${appConfigPath}==${rootConfigPath}`,
      );
    }

    let rootConfig: PackageJson;
    let folderConfig: PackageJson;

    try {
      const content = readFileSync(rootConfigPath).toString();
      rootConfig = JSON.parse(content) as PackageJson;
    } catch (error) {
      throw new Error(`Wrong body of file ${rootConfigPath}`, { cause: error });
    }

    try {
      const content = readFileSync(appConfigPath).toString();
      folderConfig = JSON.parse(content) as PackageJson;
      let shouldSave = false;

      if (updatePackageVersion && rootConfig.version) {
        folderConfig.version = rootConfig.version;
        shouldSave = true;
      }

      if (updateDependenciesVersion) {
        this.updateDependencies(folderConfig, rootConfig);
        shouldSave = true;
      }

      if (shouldSave) {
        writeFileSync(appConfigPath, JSON.stringify(folderConfig, null, 2));
      }
    } catch (_error) {
      this.logger.warn(`Wrong body of file ${appConfigPath}`);
    }

    this.logger.debug(
      `End for ${JSON.stringify({
        rootConfigPath,
        appConfigPath,
      })}`,
    );
  }

  private updateDependencies(
    folderConfig: PackageJson,
    rootConfig: PackageJson,
  ): void {
    if (folderConfig.peerDependencies && rootConfig.dependencies) {
      for (const key of Object.keys(folderConfig.peerDependencies)) {
        if (rootConfig.dependencies[key]) {
          folderConfig.peerDependencies[key] = rootConfig.dependencies[key];
        }
      }
    }

    if (folderConfig.dependencies) {
      for (const key of Object.keys(folderConfig.dependencies)) {
        if (rootConfig.dependencies?.[key]) {
          folderConfig.dependencies[key] = rootConfig.dependencies[key];
        }
        if (rootConfig.devDependencies?.[key]) {
          folderConfig.dependencies[key] = rootConfig.devDependencies[key];
        }
      }
    }
  }
}
