import { Command, Console } from 'nestjs-console';
import { ToolsConfigService } from './tools-config.service';
import { ToolsService } from './tools.service';

@Console({
  command: 'tools',
  description: 'common console nx tools',
})
export class ToolsCommands {
  private readonly config = this.toolsConfigService.getConfig('rucken.json');

  constructor(
    private readonly toolsService: ToolsService,
    private readonly toolsConfigService: ToolsConfigService
  ) {}

  @Command({
    alias: 'fl',
    command: 'files-list',
    description: 'create list of ts files for all nx libraries',
  })
  async filesList() {
    this.toolsService.setLogger('filesList');
    this.toolsService.makeTsListHandler(
      'workspace.json',
      this.config['filesList']
    );
  }

  @Command({
    alias: 'vu',
    command: 'version-updater',
    description: 'update versions in all nx applications',
  })
  async versionUpdater() {
    this.toolsService.setLogger('versionUpdater');
    this.toolsService.versionUpdaterHandler(
      'workspace.json',
      this.config['versionUpdater']
    );
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
