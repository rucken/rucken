import { Injectable } from '@nestjs/common';
import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { dirname, resolve } from 'path';
import {
  PACKAGE_JSON,
  TRANSLOCO_CONFIG_JS,
  TRANSLOCO_CONFIG_JSON,
  UtilsService,
} from '../utils/utils.service';

@Injectable()
export class Extracti18nService {
  public static title = 'extract-i18n';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  public extract({
    locales,
    markers,
    resetUnusedTranslates,
    noExtract,
    serverProjectNameParts,
    clientProjectNameParts,
    e2eProjectNameParts,
  }: {
    locales: string[];
    markers: string[];
    resetUnusedTranslates: boolean;
    noExtract?: boolean;
    serverProjectNameParts: string[];
    clientProjectNameParts: string[];
    e2eProjectNameParts: string[];
  }): void {
    this.logger.info('Start create translate files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        locales,
        markers,
        resetUnusedTranslates,
        noExtract,
        serverProjectNameParts,
        clientProjectNameParts,
        e2eProjectNameParts,
      })}`
    );
    try {
      const projects = this.utilsService.getWorkspaceProjects();

      this.createTtranslocoConfigJS();

      this.logger.info('Process applications...');
      Object.keys(projects)
        .filter(
          (projectName) =>
            projects[projectName].projectType === 'application' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'apps/'
        )
        .forEach((projectName) => {
          this.logger.debug(projectName, projects[projectName].sourceRoot);
          this.processApplication(
            projects[projectName].sourceRoot,
            resetUnusedTranslates,
            noExtract
          );
        });

      this.logger.info('Process libraries...');
      Object.keys(projects)
        .filter(
          (projectName) =>
            projects[projectName].projectType === 'library' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'libs/'
        )
        .forEach((projectName) => {
          this.logger.debug(projectName, projects[projectName].sourceRoot);
          this.processLibrary(
            projectName,
            projects[projectName].sourceRoot,
            projects[projectName].root,
            markers,
            resetUnusedTranslates,
            noExtract
          );
        });
      this.collectServerToTranslocoConfig({
        projects,
        locales,
        clientProjectNameParts,
        e2eProjectNameParts,
      });

      this.collectClientToTranslocoConfig({
        projects,
        locales,
        serverProjectNameParts,
        e2eProjectNameParts,
      });

      this.logger.info('End of create translate files...');
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }

  private createTtranslocoConfigJS() {
    const translocoConfigJsFilepath =
      this.utilsService.resolveFilePath(TRANSLOCO_CONFIG_JS);
    if (!existsSync(translocoConfigJsFilepath)) {
      this.logger.info(`Process create ${TRANSLOCO_CONFIG_JS}...`);
      writeFileSync(
        translocoConfigJsFilepath,
        [
          `const { readFileSync, existsSync } = require('fs');`,
          `module.exports = existsSync('${TRANSLOCO_CONFIG_JSON}') ? JSON.parse(readFileSync('${TRANSLOCO_CONFIG_JSON}').toString()) : {};`,
        ].join('\n')
      );
    }
  }

  collectClientToTranslocoConfig({
    projects,
    locales,
    serverProjectNameParts,
    e2eProjectNameParts,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: any;
    locales: string[];
    serverProjectNameParts: string[];
    e2eProjectNameParts: string[];
  }) {
    const translocoConfigFilepath = this.utilsService.resolveFilePath(
      TRANSLOCO_CONFIG_JSON
    );

    const scopedLibs = Object.keys(projects)
      .filter(
        (projectName) =>
          (projects[projectName].projectType === 'library' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'libs/') &&
          !serverProjectNameParts.find((serverProjectNamePart) =>
            projectName.includes(serverProjectNamePart)
          )
      )
      .map((projectName) => projects[projectName].root);

    const applications = Object.keys(projects)
      .filter(
        (projectName) =>
          (projects[projectName].projectType === 'application' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'apps/') &&
          !serverProjectNameParts.find((serverProjectNamePart) =>
            projectName.includes(serverProjectNamePart)
          ) &&
          !e2eProjectNameParts.find((e2eProjectNamePart) =>
            projectName.includes(e2eProjectNamePart)
          )
      )
      .map((projectName) => projects[projectName].sourceRoot);

    applications.forEach((sourceRoot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let translocoConfig: any = {};
      if (existsSync(translocoConfigFilepath)) {
        translocoConfig = JSON.parse(
          readFileSync(translocoConfigFilepath).toString()
        );
      }
      translocoConfig.clientRootTranslationsPath = `./${sourceRoot}/assets/i18n/`;
      translocoConfig.langs = locales;
      translocoConfig.clientScopedLibs = scopedLibs;

      translocoConfig.rootTranslationsPath = `./${sourceRoot}/assets/i18n/`;
      translocoConfig.scopedLibs = scopedLibs;

      if (!existsSync(dirname(translocoConfigFilepath))) {
        mkdirSync(dirname(translocoConfigFilepath), { recursive: true });
      }
      writeFileSync(
        translocoConfigFilepath,
        JSON.stringify(translocoConfig, null, 4)
      );
      spawnSync('transloco-keys-manager');
      spawnSync('transloco-scoped-libs', ['--skip-gitignore']);
    });
  }

  collectServerToTranslocoConfig({
    projects,
    locales,
    clientProjectNameParts,
    e2eProjectNameParts,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: any;
    locales: string[];
    clientProjectNameParts: string[];
    e2eProjectNameParts: string[];
  }) {
    const translocoConfigFilepath = this.utilsService.resolveFilePath(
      TRANSLOCO_CONFIG_JSON
    );

    const scopedLibs = Object.keys(projects)
      .filter(
        (projectName) =>
          (projects[projectName].projectType === 'library' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'libs/') &&
          !clientProjectNameParts.find((clientProjectNamePart) =>
            projectName.includes(clientProjectNamePart)
          )
      )
      .map((projectName) => projects[projectName].root);

    const applications = Object.keys(projects)
      .filter(
        (projectName) =>
          (projects[projectName].projectType === 'application' ||
            projects[projectName].sourceRoot?.substring(0, 5) === 'apps/') &&
          !clientProjectNameParts.find((clientProjectNamePart) =>
            projectName.includes(clientProjectNamePart)
          ) &&
          !e2eProjectNameParts.find((e2eProjectNamePart) =>
            projectName.includes(e2eProjectNamePart)
          )
      )
      .map((projectName) => projects[projectName].sourceRoot);

    applications.forEach((sourceRoot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const translocoConfig: any = this.loadConfig(translocoConfigFilepath);
      translocoConfig.serverRootTranslationsPath = `./${sourceRoot}/assets/i18n/`;
      translocoConfig.langs = locales;
      translocoConfig.serverScopedLibs = scopedLibs;

      translocoConfig.rootTranslationsPath = `./${sourceRoot}/assets/i18n/`;
      translocoConfig.scopedLibs = scopedLibs;

      this.saveConfig(translocoConfigFilepath, translocoConfig);
      spawnSync('transloco-keys-manager');
      spawnSync('transloco-scoped-libs', ['--skip-gitignore']);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveConfig(translocoConfigFilepath: string, translocoConfig: any) {
    if (!existsSync(dirname(translocoConfigFilepath))) {
      mkdirSync(dirname(translocoConfigFilepath), { recursive: true });
    }
    writeFileSync(
      translocoConfigFilepath,
      JSON.stringify(translocoConfig, null, 4)
    );
  }

  loadConfig(translocoConfigFilepath: string) {
    if (existsSync(translocoConfigFilepath)) {
      return JSON.parse(readFileSync(translocoConfigFilepath).toString());
    }

    return {};
  }

  processApplication(
    sourceRoot: string,
    resetUnusedTranslates: boolean,
    noExtract: boolean
  ) {
    if (!noExtract) {
      spawnSync('transloco-keys-manager', [
        'extract',
        ...(resetUnusedTranslates ? ['--replace'] : []),
        '--input',
        `${resolve(sourceRoot)}`,
        '--output',
        `${resolve(sourceRoot)}/assets/i18n`,
      ]);
    }
  }

  processLibrary(
    projectName: string,
    sourceRoot: string,
    root: string,
    markers: string[],
    resetUnusedTranslates: boolean,
    noExtract: boolean
  ) {
    if (!noExtract) {
      spawnSync('transloco-keys-manager', [
        'extract',
        ...(resetUnusedTranslates ? ['--replace'] : []),
        '--input',
        `${resolve(sourceRoot)}`,
        '--output',
        `${resolve(sourceRoot)}/i18n`,
      ]);
    }
    const packageJsonFilePath = this.utilsService.resolveFilePath(
      PACKAGE_JSON,
      root
    );
    try {
      const packageJson = existsSync(packageJsonFilePath)
        ? JSON.parse(readFileSync(packageJsonFilePath).toString())
        : {};
      packageJson.i18n = [
        {
          scope: projectName,
          path: 'src/i18n',
          strategy: 'join',
        },
      ];
      markers.forEach((marker) => {
        if (
          existsSync(
            resolve(dirname(packageJsonFilePath), `src/i18n/${marker}`)
          )
        ) {
          packageJson.i18n.push({
            scope: `${projectName}-${marker}`,
            path: `src/i18n/${marker}`,
            strategy: 'join',
          });
        }
      });
      if (!existsSync(dirname(packageJsonFilePath))) {
        mkdirSync(dirname(packageJsonFilePath), { recursive: true });
      }
      writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null, 4));
    } catch (err) {
      this.logger.error(`Error in file: ${packageJsonFilePath}`);
      this.logger.error(err);
    }
  }
}
