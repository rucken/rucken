import { Command, Console } from '../../nestjs-console';
import { DEFAULT_EXTRACT_I18N_CONFIG } from '../extract-i18n/extract-i18n.config';
import { Extracti18nService } from '../extract-i18n/extract-i18n.service';
import { DEFAULT_GETTEXT_CONFIG } from '../gettext/gettext.config';
import { GettextService } from '../gettext/gettext.service';
import { UtilsService } from '../utils/utils.service';

@Console()
export class TranslateCommands {
  private extracti18nConfig: Record<string, unknown> = {};
  private gettextConfig: Record<string, unknown> = {};

  constructor(
    private readonly gettextService: GettextService,
    private readonly extracti18nService: Extracti18nService,
    private readonly utilsService: UtilsService,
  ) {
    this.extracti18nConfig = this.utilsService.getRuckenConfig(
      DEFAULT_EXTRACT_I18N_CONFIG,
    ).extracti18n as Record<string, unknown>;
    this.gettextConfig = this.utilsService.getRuckenConfig(
      DEFAULT_GETTEXT_CONFIG,
    ).gettext as Record<string, unknown>;
  }

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
      {
        flags: '-epnp,--e2e-project-name-parts [string]',
      },
      {
        flags: '-cpnp,--client-project-name-parts [string]',
      },
      {
        flags: '-spnp,--server-project-name-parts [string]',
      },
    ],
  })
  async translate({
    defaultLocale,
    locales,
    resetUnusedTranslates,
    clientProjectNameParts,
    e2eProjectNameParts,
    serverProjectNameParts,
  }: {
    defaultLocale: string;
    locales: string;
    resetUnusedTranslates?: string;
    clientProjectNameParts?: string;
    e2eProjectNameParts?: string;
    serverProjectNameParts?: string;
  }) {
    const resetUnusedTranslatesBoolean =
      (
        resetUnusedTranslates ||
        (this.gettextConfig.resetUnusedTranslates as string) ||
        'false'
      ).toLowerCase() === 'true';

    this.extracti18nService.setLogger(`prepare: ${Extracti18nService.title}`);
    this.gettextService.setLogger(`prepare: ${GettextService.title}`);

    if (resetUnusedTranslatesBoolean) {
      await this.gettextService.extractTranslatesFromSourcesForLibraries({
        po2jsonOptions: this.gettextConfig.po2jsonOptions as Record<
          string,
          unknown
        >,
        pattern: (
          this.gettextConfig.gettextExtractorOptions as Record<string, unknown>
        )?.pattern as string,
        locales: locales
          ? locales.split(',')
          : (this.gettextConfig.locales as string[]),
        defaultLocale:
          defaultLocale || (this.gettextConfig.defaultLocale as string),
        markers: this.gettextConfig.markers as string[],
      });
    }

    this.extracti18nService.extract({
      locales: locales
        ? locales.split(',')
        : (this.extracti18nConfig.locales as string[]),
      markers: this.extracti18nConfig.markers as string[],
      resetUnusedTranslates: resetUnusedTranslatesBoolean,
      clientProjectNameParts:
        clientProjectNameParts?.split(',') ||
        (this.extracti18nConfig.clientProjectNameParts as string[]),
      e2eProjectNameParts:
        e2eProjectNameParts?.split(',') ||
        (this.extracti18nConfig.e2eProjectNameParts as string[]),
      serverProjectNameParts:
        serverProjectNameParts?.split(',') ||
        (this.extracti18nConfig.serverProjectNameParts as string[]),
    });

    await this.gettextService.extractTranslatesFromSourcesForLibraries({
      po2jsonOptions: this.gettextConfig.po2jsonOptions as Record<
        string,
        unknown
      >,
      pattern: (
        this.gettextConfig.gettextExtractorOptions as Record<string, string>
      )?.pattern,
      locales: locales
        ? locales.split(',')
        : (this.gettextConfig.locales as string[]),
      defaultLocale:
        defaultLocale || (this.gettextConfig.defaultLocale as string),
      markers: this.gettextConfig.markers as string[],
    });

    this.extracti18nService.extract({
      locales: locales
        ? locales.split(',')
        : (this.extracti18nConfig.locales as string[]),
      markers: this.extracti18nConfig.markers as string[],
      resetUnusedTranslates: resetUnusedTranslatesBoolean,
      noExtract: true,
      clientProjectNameParts:
        clientProjectNameParts?.split(',') ||
        (this.extracti18nConfig.clientProjectNameParts as string[]),
      e2eProjectNameParts:
        e2eProjectNameParts?.split(',') ||
        (this.extracti18nConfig.e2eProjectNameParts as string[]),
      serverProjectNameParts:
        serverProjectNameParts?.split(',') ||
        (this.extracti18nConfig.serverProjectNameParts as string[]),
    });
  }
}
