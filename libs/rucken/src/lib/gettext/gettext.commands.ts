import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_GETTEXT_CONFIG } from './gettext.config';
import { GettextService } from './gettext.service';

@Console()
export class GettextCommands {
  private config: Record<string, unknown> = {};

  constructor(
    private readonly gettextService: GettextService,
    private readonly utilsService: UtilsService,
  ) {
    this.config = (this.utilsService.getRuckenConfig(DEFAULT_GETTEXT_CONFIG)
      .gettext || {}) as Record<string, unknown>;
  }

  @Command({
    command: 'gettext',
    description: 'translate marker extractor',
    options: [
      {
        flags: '-l,--locales [strings]',
        description: 'list of available languages (example: ru,en)',
      },
      {
        flags: '-dl,--default-locale [string]',
        description: 'default locale (default: en)',
      },
    ],
  })
  async gettext({
    defaultLocale,
    locales,
  }: {
    defaultLocale: string;
    locales: string;
  }) {
    this.gettextService.setLogger(GettextService.title);
    await this.gettextService.extractTranslatesFromSourcesForLibraries({
      po2jsonOptions: this.config.po2jsonOptions as Record<string, unknown>,
      pattern: (this.config.gettextExtractorOptions as Record<string, string>)
        ?.pattern,
      locales: locales ? locales.split(',') : (this.config.locales as string[]),
      defaultLocale: defaultLocale || (this.config.defaultLocale as string),
      markers: this.config.markers as string[],
    });
  }
}
