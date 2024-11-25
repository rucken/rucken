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

  async makeTsListHandler({
    indexFileName,
    excludes,
  }: {
    indexFileName: string;
    excludes: string[];
  }) {
    this.logger.info('Start create list files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        indexFileName,
        excludes,
      })}`
    );

    const projects = this.utilsService.getWorkspaceProjects();

    const projectNames = Object.keys(projects)
      .filter(
        (projectName) =>
          projects[projectName].projectType === 'library' ||
          projects[projectName].sourceRoot?.substring(0, 5) === 'libs/'
      )
      .filter((key) => !key.includes('-e2e'));
    for (let index = 0; index < projectNames.length; index++) {
      const projectName = projectNames[index];
      if (projects[projectName].sourceRoot) {
        this.logger.debug(
          `Process library "${projectName}" in ${projects[projectName].sourceRoot}`
        );
        await this.processLibrary({
          path: projects[projectName].sourceRoot,
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
  }) {
    const indexFilePath = resolve(path, `${indexFileName}.ts`);
    const newExcludes = ['!*.ts*', ...excludes, indexFilePath];
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    let files = await recursive(path, newExcludes);
    files = sortPaths(files, sep);
    const list: string[] = [];
    for (let findex = 0; findex < files.length; findex++) {
      const file = files[findex].split(sep).join('/');
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
    }
    const body = `${list.join('\n')}\n`;
    if (list.join('').length > 0) {
      if (!existsSync(dirname(indexFilePath))) {
        mkdirSync(dirname(indexFilePath), { recursive: true });
      }
      writeFileSync(indexFilePath, body);
    }
  }
}
