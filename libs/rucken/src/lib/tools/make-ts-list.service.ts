import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { dirname, resolve, sep } from 'path';
import recursive from 'recursive-readdir';
import replaceExt from 'replace-ext';
import sortPaths from 'sort-paths';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class MakeTsListService {
  public static title = 'make-ts-list';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  makeTsListHandler({
    indexFileName,
    excludes,
  }: {
    indexFileName: string;
    excludes: string[];
  }): void {
    this.logger.info('Start create list files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        indexFileName,
        excludes,
      })}`
    );

    const projects = this.utilsService.getWorkspaceProjects();

    Object.keys(projects)
      .filter(
        (projectName) =>
          projects[projectName].projectType === 'library' ||
          projects[projectName].sourceRoot?.substring(0, 5) === 'libs/'
      )
      .filter((key) => !key.includes('-e2e'))
      .forEach((projectName) => {
        this.logger.debug(
          `Process library "${projectName}" in ${projects[projectName].sourceRoot}`
        );
        this.processLibrary({
          path: projects[projectName].sourceRoot,
          indexFileName,
          excludes,
        });
      });
    this.logger.info('End of create list files...');
  }

  private processLibrary({
    path,
    indexFileName,
    excludes,
  }: {
    path: string;
    indexFileName: string;
    excludes: string[];
  }): void {
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
}
