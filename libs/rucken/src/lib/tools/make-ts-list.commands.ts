import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { MakeTsListService } from './make-ts-list.service';
import { DEFAULT_TOOLS_CONFIG } from './tools.config';

@Console()
export class MakeTsListCommands {
  private readonly config =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).makeTsList;

  constructor(
    private readonly makeTsListService: MakeTsListService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    alias: 'mtsl',
    command: 'make-ts-list',
    description: 'create list of ts files for all nx libraries',
  })
  async makeTsList() {
    this.makeTsListService.setLogger(MakeTsListService.title);
    await this.makeTsListService.makeTsListHandler({
      indexFileName: this.config.indexFileName,
      excludes: this.config.excludes,
    });
  }
}
