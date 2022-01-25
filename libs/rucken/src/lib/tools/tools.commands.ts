import { Command, Console } from 'nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_TOOLS_CONFIG } from './tools.config';
import { ToolsService } from './tools.service';

@Console({
  command: 'tools',
  description: 'common console nx tools',
})
export class ToolsCommands {
  private readonly filesListConfig =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).filesList;
  private readonly versionUpdaterConfig =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).versionUpdater;

  constructor(
    private readonly toolsService: ToolsService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    alias: 'fl',
    command: 'files-list',
    description: 'create list of ts files for all nx libraries',
  })
  async filesList() {
    this.toolsService.setLogger('files-list');
    this.toolsService.makeTsListHandler({
      indexFileName: this.filesListConfig.indexFileName,
      excludes: this.filesListConfig.excludes,
    });
  }

  @Command({
    alias: 'vu',
    command: 'version-updater',
    description: 'update versions in all nx applications',
    options: [
      {
        flags: '-upv,--update-package-version [boolean]',
        description: 'update package version (default: true)',
      },
    ],
  })
  async versionUpdater({
    updatePackageVersion,
  }: {
    updatePackageVersion?: string;
  } = {}) {
    this.toolsService.setLogger('version-updater');
    this.toolsService.versionUpdaterHandler({
      updatePackageVersion: updatePackageVersion
        ? updatePackageVersion.toUpperCase().trim() === 'TRUE'
        : this.versionUpdaterConfig.updatePackageVersion,
    });
  }

  @Command({
    alias: 'a',
    command: 'all',
    description:
      'create list of ts files for all nx libraries + update versions in all nx applications',
  })
  async all() {
    this.filesList();
    this.versionUpdater();
  }
}
