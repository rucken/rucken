import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_TOOLS_CONFIG } from './tools.config';
import { VersionUpdaterService } from './version-updater.service';

@Console()
export class VersionUpdaterCommands {
  private config: Record<string, unknown> = {};

  constructor(
    private readonly versionUpdaterService: VersionUpdaterService,
    private readonly utilsService: UtilsService,
  ) {
    this.config = this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG)
      .versionUpdater as Record<string, unknown>;
  }

  @Command({
    alias: 'vu',
    command: 'version-updater',
    description: 'update versions in all nx applications',
    options: [
      {
        flags: '--update-package-version [boolean]',
        description: 'update package version (default: true)',
      },
      {
        flags: '--update-dependencies-version [boolean]',
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
  } = {}): Promise<void> {
    this.versionUpdaterService.setLogger(VersionUpdaterService.title);

    const shouldUpdatePackageVersion = updatePackageVersion
      ? updatePackageVersion.toUpperCase().trim() === 'TRUE'
      : (this.config.updatePackageVersion as boolean);

    const shouldUpdateDependenciesVersion = updateDependenciesVersion
      ? updateDependenciesVersion.toUpperCase().trim() === 'TRUE'
      : (this.config.updateDependenciesVersion as boolean);

    this.versionUpdaterService.versionUpdaterHandler({
      updatePackageVersion: shouldUpdatePackageVersion,
      updateDependenciesVersion: shouldUpdateDependenciesVersion,
    });
  }
}
