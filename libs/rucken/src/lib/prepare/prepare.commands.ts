import { Command, Console } from '../../nestjs-console';
import { DEFAULT_EXTRACT_I18N_CONFIG } from '../extract-i18n/extract-i18n.config';
import { Extracti18nService } from '../extract-i18n/extract-i18n.service';
import { DEFAULT_GETTEXT_CONFIG } from '../gettext/gettext.config';
import { GettextService } from '../gettext/gettext.service';
import { MakeTsListService } from '../tools/make-ts-list.service';
import { DEFAULT_TOOLS_CONFIG } from '../tools/tools.config';
import { VersionUpdaterService } from '../tools/version-updater.service';
import { UtilsService } from '../utils/utils.service';

@Console()
export class PrepareCommands {
  private readonly extracti18nConfig = this.utilsService.getRuckenConfig(
    DEFAULT_EXTRACT_I18N_CONFIG
  ).extracti18n;

  private readonly gettextConfig = this.utilsService.getRuckenConfig(
    DEFAULT_GETTEXT_CONFIG
  ).gettext;

  private readonly makeTsListConfig =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).makeTsList;

  private readonly versionUpdaterConfig =
    this.utilsService.getRuckenConfig(DEFAULT_TOOLS_CONFIG).versionUpdater;

  constructor(
    private readonly gettextService: GettextService,
    private readonly extracti18nService: Extracti18nService,
    private readonly versionUpdaterService: VersionUpdaterService,
    private readonly makeTsListService: MakeTsListService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    command: 'prepare',
    description: 'make-ts-list + version-update + translate',
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
        flags: '-upv,--update-package-version [boolean]',
        description: 'update package version (default: true)',
      },
      {
        flags: '-udv,--update-dependencies-version [boolean]',
        description: 'update dependencies version (default: true)',
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
  async prepare({
    defaultLocale,
    locales,
    resetUnusedTranslates,
    updatePackageVersion,
    updateDependenciesVersion,
    clientProjectNameParts,
    e2eProjectNameParts,
    serverProjectNameParts,
  }: {
    defaultLocale: string;
    locales: string;
    resetUnusedTranslates?: string;
    updatePackageVersion?: string;
    updateDependenciesVersion?: string;
    clientProjectNameParts?: string;
    e2eProjectNameParts?: string;
    serverProjectNameParts?: string;
  }) {
    const resetUnusedTranslatesBoolean =
      (
        resetUnusedTranslates ||
        this.gettextConfig.resetUnusedTranslates ||
        'false'
      ).toLowerCase() === 'true';

    this.makeTsListService.setLogger(`prepare: ${MakeTsListService.title}`);

    await this.makeTsListService.makeTsListHandler({
      indexFileName: this.makeTsListConfig.indexFileName,
      excludes: this.makeTsListConfig.excludes,
    });

    this.versionUpdaterService.setLogger(
      `prepare: ${VersionUpdaterService.title}`
    );
    this.versionUpdaterService.versionUpdaterHandler({
      updatePackageVersion: updatePackageVersion
        ? updatePackageVersion.toUpperCase().trim() === 'TRUE'
        : this.versionUpdaterConfig.updatePackageVersion,
      updateDependenciesVersion: updateDependenciesVersion
        ? updateDependenciesVersion.toUpperCase().trim() === 'TRUE'
          ? true
          : false
        : this.versionUpdaterConfig.updateDependenciesVersion,
    });

    this.extracti18nService.setLogger(`prepare: ${Extracti18nService.title}`);
    this.gettextService.setLogger(`prepare: ${GettextService.title}`);

    if (resetUnusedTranslatesBoolean) {
      await this.gettextService.extractTranslatesFromSourcesForLibraries({
        po2jsonOptions: this.gettextConfig.po2jsonOptions,
        pattern: this.gettextConfig.gettextExtractorOptions.pattern,
        locales: locales ? locales.split(',') : this.gettextConfig.locales,
        defaultLocale: defaultLocale || this.gettextConfig.defaultLocale,
        markers: this.gettextConfig.markers,
      });
    }

    this.extracti18nService.extract({
      locales: locales ? locales.split(',') : this.extracti18nConfig.locales,
      markers: this.extracti18nConfig.markers,
      resetUnusedTranslates: resetUnusedTranslatesBoolean,
      clientProjectNameParts:
        clientProjectNameParts?.split(',') ||
        this.extracti18nConfig.clientProjectNameParts,
      e2eProjectNameParts:
        e2eProjectNameParts?.split(',') ||
        this.extracti18nConfig.e2eProjectNameParts,
      serverProjectNameParts:
        serverProjectNameParts?.split(',') ||
        this.extracti18nConfig.serverProjectNameParts,
    });

    await this.gettextService.extractTranslatesFromSourcesForLibraries({
      po2jsonOptions: this.gettextConfig.po2jsonOptions,
      pattern: this.gettextConfig.gettextExtractorOptions.pattern,
      locales: locales ? locales.split(',') : this.gettextConfig.locales,
      defaultLocale: defaultLocale || this.gettextConfig.defaultLocale,
      markers: this.gettextConfig.markers,
    });

    this.extracti18nService.extract({
      locales: locales ? locales.split(',') : this.extracti18nConfig.locales,
      markers: this.extracti18nConfig.markers,
      resetUnusedTranslates: resetUnusedTranslatesBoolean,
      noExtract: true,
      clientProjectNameParts:
        clientProjectNameParts?.split(',') ||
        this.extracti18nConfig.clientProjectNameParts,
      e2eProjectNameParts:
        e2eProjectNameParts?.split(',') ||
        this.extracti18nConfig.e2eProjectNameParts,
      serverProjectNameParts:
        serverProjectNameParts?.split(',') ||
        this.extracti18nConfig.serverProjectNameParts,
    });
  }
}
