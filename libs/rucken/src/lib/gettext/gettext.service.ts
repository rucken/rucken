import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';

@Injectable()
export class GettextService {
  private logger: Logger;

  setLogger(command: string): void {
    this.logger = getLogger(`${GettextService.name}: ${command}`);
    this.logger.level = 'all';
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
