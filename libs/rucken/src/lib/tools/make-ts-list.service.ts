import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { dirname, resolve, sep } from 'path';
import recursive from 'recursive-readdir';
import replaceExt from 'replace-ext';
// @ts-expect-error - No type definitions available for sort-paths
import sortPaths from 'sort-paths';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class MakeTsListService {
  public static title = 'make-ts-list';

  private logger!: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  async makeTsListHandler({
    indexFileName,
    excludes,
  }: {
    indexFileName: string;
    excludes: string[];
  }): Promise<void> {
    this.logger.info('Start create list files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        indexFileName,
        excludes,
      })}`,
    );

    const projects = this.utilsService.getWorkspaceProjects();

    const projectNames = Object.keys(projects)
      .filter(
        (projectName) =>
          projects[projectName].projectType === 'library' ||
          projects[projectName].sourceRoot?.substring(0, 5) === 'libs/',
      )
      .filter((key) => !key.includes('-e2e'));

    for (const projectName of projectNames) {
      const project = projects[projectName];
      if (project.sourceRoot) {
        this.logger.debug(
          `Process library "${projectName}" in ${project.sourceRoot}`,
        );
        await this.processLibrary({
          path: project.sourceRoot,
          indexFileName,
          excludes,
        });
      }
    }

    this.logger.info('End of create list files...');
  }

  private async processLibrary({
    path,
    indexFileName,
    excludes,
  }: {
    path: string;
    indexFileName: string;
    excludes: string[];
  }): Promise<void> {
    const indexFilePath = resolve(path, `${indexFileName}.ts`);
    const newExcludes = ['!*.ts*', ...excludes, indexFilePath];

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    let files = await recursive(path, newExcludes);
    files = sortPaths(files, sep);

    const exportStatements: string[] = [];
    for (const file of files) {
      const normalizedFile = file.split(sep).join('/');
      let localFile = replaceExt(
        normalizedFile
          .replace(path, '')
          .replace(new RegExp(`\\${sep}`, 'g'), '/'),
        '',
      )
        .split(sep)
        .join('/');

      if (localFile && localFile[0] === '/') {
        localFile = `.${localFile}`;
      }

      if (localFile !== `./${indexFileName}`) {
        exportStatements.push(`export * from '${localFile}';`);
      }
    }

    const body = `${exportStatements.join('\n')}\n`;
    if (exportStatements.join('').length > 0) {
      const indexDir = dirname(indexFilePath);
      if (!existsSync(indexDir)) {
        mkdirSync(indexDir, { recursive: true });
      }
      writeFileSync(indexFilePath, body);
    }
  }
}
