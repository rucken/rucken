import { Command, Console } from 'nestjs-console';
import { GettextConfigService } from './gettext-config.service';
import { GettextService } from './gettext.service';

@Console()
export class GettextCommands {
  private readonly config = this.gettextConfigService.getConfig();

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
        flags: '-dl,--default-locale [default]',
        description: 'default locale',
        defaultValue: 'en',
      },
    ],
  })
  async filesList({
    defaultLocale,
    locales,
  }: {
    defaultLocale: string;
    locales: string;
  }) {
    console.log({ defaultLocale, locales });
    this.gettextService.setLogger('gettext');
    this.gettextService.extractTranslatesFromSourcesForLibraries(
      'workspace.json',
      locales.split(','),
      defaultLocale
    );
  }
}
