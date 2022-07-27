import { Command, Console } from 'nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_GETTEXT_CONFIG } from './gettext.config';
import { GettextService } from './gettext.service';

@Console()
export class GettextCommands {
  private readonly config = this.utilsService.getRuckenConfig(
    DEFAULT_GETTEXT_CONFIG
  ).gettext;

  constructor(
    private readonly gettextService: GettextService,
    private readonly utilsService: UtilsService
  ) {}

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
      {
        flags: '-rut,--reset-unused-translates [boolean]',
        description:
          'remove all translates if they not found in source code (default: true)',
        defaultValue: 'true',
      },
    ],
  })
  async gettext({
    defaultLocale,
    locales,
    resetUnusedTranslates,
  }: {
    defaultLocale: string;
    locales: string;
    resetUnusedTranslates?: string;
  }) {
    this.gettextService.setLogger(GettextService.title);
    this.gettextService.extractTranslatesFromSourcesForLibraries({
      po2jsonOptions: this.config.po2jsonOptions,
      pattern: this.config.gettextExtractorOptions.pattern,
      locales: locales ? locales.split(',') : this.config.locales,
      defaultLocale: defaultLocale || this.config.defaultLocale,
      markers: this.config.markers,
      resetUnusedTranslates:
        (
          resetUnusedTranslates ||
          this.config.resetUnusedTranslates ||
          'false'
        ).toLowerCase() === 'true',
    });
  }
}
