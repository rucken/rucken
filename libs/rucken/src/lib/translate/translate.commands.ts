import { Command, Console } from 'nestjs-console';
import { DEFAULT_EXTRACT_I18N_CONFIG } from '../extract-i18n/extract-i18n.config';
import { Extracti18nService } from '../extract-i18n/extract-i18n.service';
import { DEFAULT_GETTEXT_CONFIG } from '../gettext/gettext.config';
import { GettextService } from '../gettext/gettext.service';
import { UtilsService } from '../utils/utils.service';

@Console()
export class TranslateCommands {
  private readonly extracti18nConfig = this.utilsService.getRuckenConfig(
    DEFAULT_EXTRACT_I18N_CONFIG
  ).extracti18n;

  private readonly gettextConfig = this.utilsService.getRuckenConfig(
    DEFAULT_GETTEXT_CONFIG
  ).gettext;

  constructor(
    private readonly gettextService: GettextService,
    private readonly extracti18nService: Extracti18nService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    command: 'translate',
    description:
      'extract translate from source (run: extract-i18n => gettext => extract-i18n)',
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
  async translate({
    defaultLocale,
    locales,
    resetUnusedTranslates,
  }: {
    defaultLocale: string;
    locales: string;
    resetUnusedTranslates?: string;
  }) {
    this.gettextService.setLogger(`translate: ${GettextService.title}`);
    this.extracti18nService.setLogger(`translate: ${Extracti18nService.title}`);

    this.extracti18nService.extract(
      locales ? locales.split(',') : this.extracti18nConfig.locales,
      this.extracti18nConfig.markers,
      (
        resetUnusedTranslates ||
        this.gettextConfig.resetUnusedTranslates ||
        'false'
      ).toLowerCase() === 'true'
    );

    this.gettextService.extractTranslatesFromSourcesForLibraries({
      po2jsonOptions: this.gettextConfig.po2jsonOptions,
      pattern: this.gettextConfig.gettextExtractorOptions.pattern,
      locales: locales ? locales.split(',') : this.gettextConfig.locales,
      defaultLocale: defaultLocale || this.gettextConfig.defaultLocale,
      markers: this.gettextConfig.markers,
      resetUnusedTranslates:
        (
          resetUnusedTranslates ||
          this.gettextConfig.resetUnusedTranslates ||
          'false'
        ).toLowerCase() === 'true',
    });

    this.extracti18nService.extract(
      locales ? locales.split(',') : this.extracti18nConfig.locales,
      this.extracti18nConfig.markers,
      false,
      true
    );
  }
}
