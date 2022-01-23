import { Command, Console } from 'nestjs-console';
import { GettextConfigService } from './gettext-config.service';
import { GettextService } from './gettext.service';

@Console()
export class GettextCommands {
  private readonly config = this.gettextConfigService.getConfig('rucken.json');

  constructor(
    private readonly gettextService: GettextService,
    private readonly gettextConfigService: GettextConfigService
  ) {}

  @Command({
    command: 'gettext',
    description: 'translate marker extractor',
    options: [
      {
        flags: '-l,--locales [locales]',
        description: 'list of available languages',
        required: true,
      },
      {
        flags: '-d,--default [default]',
        description: 'default locale',
        defaultValue: 'en',
      },
    ],
  })
  async filesList(argument: { default: string; locales: string }) {
    this.gettextService.setLogger('gettext');
    console.log({
      argument,
    });
  }
}
