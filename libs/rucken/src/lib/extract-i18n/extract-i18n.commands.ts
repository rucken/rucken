import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_EXTRACT_I18N_CONFIG } from './extract-i18n.config';
import { Extracti18nService } from './extract-i18n.service';

@Console()
export class Extracti18nCommands {
  private readonly config = this.utilsService.getRuckenConfig(
    DEFAULT_EXTRACT_I18N_CONFIG
  ).extracti18n;

  constructor(
    private readonly extracti18nService: Extracti18nService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    command: 'extract-i18n',
    description:
      'translate marker extractor (use: transloco-keys-manager + transloco-scoped-libs)',
    options: [
      {
        flags: '-l,--locales [strings]',
        description: 'list of available languages (example: ru,en)',
      },
      {
        flags: '-rut,--reset-unused-translates [boolean]',
        description:
          'remove all translates if they not found in source code (default: true)',
        defaultValue: 'true',
      },
      {
        flags: '-epnp,--e2e-project-name-parts [string]',
        defaultValue: 'e2e',
      },
      {
        flags: '-cpnp,--client-project-name-parts [string]',
        defaultValue: 'client',
      },
      {
        flags: '-spnp,--server-project-name-parts [string]',
        defaultValue: 'server,-ms',
      },
    ],
  })
  async extracti18n({
    locales,
    resetUnusedTranslates,
    clientProjectNameParts,
    e2eProjectNameParts,
    serverProjectNameParts,
  }: {
    locales: string;
    resetUnusedTranslates?: string;
    clientProjectNameParts?: string;
    e2eProjectNameParts?: string;
    serverProjectNameParts?: string;
  }) {
    this.extracti18nService.setLogger(Extracti18nService.title);
    this.extracti18nService.extract({
      locales: locales ? locales.split(',') : this.config.locales,
      markers: this.config.markers,
      resetUnusedTranslates:
        (
          resetUnusedTranslates ||
          this.config.resetUnusedTranslates ||
          'false'
        ).toLowerCase() === 'true',
      clientProjectNameParts: clientProjectNameParts.split(','),
      e2eProjectNameParts: e2eProjectNameParts.split(','),
      serverProjectNameParts: serverProjectNameParts.split(','),
    });
  }
}
