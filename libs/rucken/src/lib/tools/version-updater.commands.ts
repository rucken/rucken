import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_TOOLS_CONFIG } from './tools.config';
import { VersionUpdaterService } from './version-updater.service';

@Console()
export class VersionUpdaterCommands {
  private readonly config =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).versionUpdater;

  constructor(
    private readonly versionUpdaterService: VersionUpdaterService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    alias: 'vu',
    command: 'version-updater',
    description: 'update versions in all nx applications',
    options: [
      {
        flags: '-upv,--update-package-version [boolean]',
        description: 'update package version (default: true)',
      },
      {
        flags: '-udv,--update-dependencies-version [boolean]',
        description: 'update dependencies version (default: true)',
      },
    ],
  })
  async versionUpdater({
    updatePackageVersion,
    updateDependenciesVersion,
  }: {
    updatePackageVersion?: string;
    updateDependenciesVersion?: string;
  } = {}) {
    this.versionUpdaterService.setLogger(VersionUpdaterService.title);
    this.versionUpdaterService.versionUpdaterHandler({
      updatePackageVersion: updatePackageVersion
        ? updatePackageVersion.toUpperCase().trim() === 'TRUE'
          ? true
          : false
        : this.config.updatePackageVersion,
      updateDependenciesVersion: updateDependenciesVersion
        ? updateDependenciesVersion.toUpperCase().trim() === 'TRUE'
          ? true
          : false
        : this.config.updateDependenciesVersion,
    });
  }
}
