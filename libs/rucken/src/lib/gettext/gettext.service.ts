import { Injectable } from '@nestjs/common';
import { parseFileSync } from '@rjaros/po2json';
import equal from 'fast-deep-equal';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import { i18nextToPo, i18nextToPot } from 'i18next-conv';
import { getLogger, Logger } from 'log4js';
import { dirname, resolve } from 'path';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class GettextService {
  public static title = 'gettext';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  public extractTranslatesFromSourcesForLibraries({
    po2jsonOptions,
    pattern,
    locales,
    defaultLocale,
    markers,
    resetUnusedTranslates,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    po2jsonOptions: Record<string, any>;
    pattern: string;
    locales: string[];
    defaultLocale: string;
    markers: string[];
    resetUnusedTranslates?: boolean;
  }): void {
    this.logger.info('Start create translate files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        po2jsonOptions,
        pattern,
        locales,
        defaultLocale,
        markers,
        resetUnusedTranslates,
      })}`
    );
    try {
      const projects = this.utilsService.getWorkspaceProjects();
      const projectNames = Object.keys(projects);
      for (let pIdx = 0; pIdx < projectNames.length; pIdx++) {
        const projectName = projectNames[pIdx];
        this.logger.debug(projectName, projects[projectName].sourceRoot);
        const assetsPath =
          projects[projectName].projectType === 'application' ? 'assets' : '';
        for (let lIdx = 0; lIdx < locales.length; lIdx++) {
          const locale = locales[lIdx];
          this.processLibrary({
            po2jsonOptions,
            pattern,
            sourceRoot: projects[projectName].sourceRoot,
            defaultLocale,
            marker: '',
            locale,
            assetsPath,
            resetUnusedTranslates,
          });
          for (let mIdx = 0; mIdx < markers.length; mIdx++) {
            const marker = markers[mIdx];
            this.processLibrary({
              po2jsonOptions,
              pattern,
              sourceRoot: projects[projectName].sourceRoot,
              defaultLocale,
              marker,
              locale,
              assetsPath,
              resetUnusedTranslates,
            });
          }
        }
      }
      this.logger.info('End of create translate files...');
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }

  private processLibrary({
    po2jsonOptions,
    pattern,
    sourceRoot,
    defaultLocale,
    marker,
    locale,
    assetsPath,
    resetUnusedTranslates,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    po2jsonOptions: Record<string, any>;
    pattern: string;
    sourceRoot: string;
    defaultLocale: string;
    marker?: string;
    locale?: string;
    assetsPath?: string;
    resetUnusedTranslates?: boolean;
  }) {
    const defaultJsonFileName = `${defaultLocale}.json`;
    const defaultPotFileName = 'template.pot';
    const defaultPotFile = resolve(
      sourceRoot,
      assetsPath || '',
      'i18n',
      marker ? marker : '',
      defaultPotFileName
    );
    const defaultJsonFile = resolve(
      sourceRoot,
      assetsPath || '',
      'i18n',
      marker ? marker : '',
      defaultJsonFileName
    );
    let defaultJsonData: Record<string, unknown> = {};
    let newDefaultJsonData: Record<string, unknown> = {};

    const localeJsonFileName = `${locale}.json`;
    const localePoFileName = `${locale}.po`;
    const localeJsonFile = resolve(
      sourceRoot,
      assetsPath || '',
      'i18n',
      marker ? marker : '',
      localeJsonFileName
    );
    const localePoFile = resolve(
      sourceRoot,
      assetsPath || '',
      'i18n',
      marker ? marker : '',
      localePoFileName
    );
    let localeJsonData: Record<string, unknown> = {};
    let newLocaleJsonData: Record<string, unknown> = {};

    let newJsonData: Record<string, unknown> = {};

    let extractor: GettextExtractor | null = null;
    if (marker) {
      extractor = new GettextExtractor();
      extractor
        .createJsParser([
          JsExtractors.callExpression(marker, {
            arguments: {
              text: 0,
              context: 1,
            },
          }),
        ])
        .parseFilesGlob(`./${sourceRoot}/${pattern}`);
    }

    if (existsSync(defaultJsonFile)) {
      try {
        defaultJsonData = JSON.parse(readFileSync(defaultJsonFile).toString());

        if (Object.keys(defaultJsonData).length === 0) {
          unlinkSync(defaultJsonFile);
        }
      } catch (error) {
        defaultJsonData = {};
      }
    }

    if (existsSync(localeJsonFile)) {
      try {
        localeJsonData = JSON.parse(readFileSync(localeJsonFile).toString());

        if (Object.keys(localeJsonData).length === 0) {
          unlinkSync(localeJsonFile);
        }
      } catch (error) {
        localeJsonData = {};
      }
    }

    const newDefaultPotJsonData = existsSync(defaultPotFile)
      ? parseFileSync(defaultPotFile, po2jsonOptions)
      : {};
    // считываем пот файл
    newDefaultJsonData = {
      ...defaultJsonData,
      ...(resetUnusedTranslates ? {} : newDefaultPotJsonData),
    };

    const newLocaleJsonPoData = existsSync(localePoFile)
      ? parseFileSync(localePoFile, po2jsonOptions)
      : {};
    // считываем по файл локали
    newLocaleJsonData = {
      ...localeJsonData,
      ...(resetUnusedTranslates ? {} : newLocaleJsonPoData),
    };

    // чистим значения помеченные как отсутствующие
    // для дефолтного языка ставим ключ в качестве значения
    Object.keys(newDefaultJsonData).forEach((key) => {
      if (newDefaultJsonData[key] === `Missing value for '${key}'`) {
        if (locale === defaultLocale) {
          newDefaultJsonData[key] = key;
        } else {
          newDefaultJsonData[key] = '';
        }
      }
    });
    Object.keys(newLocaleJsonData).forEach((key) => {
      if (newLocaleJsonData[key] === `Missing value for '${key}'`) {
        if (locale === defaultLocale) {
          newLocaleJsonData[key] = key;
        } else {
          newLocaleJsonData[key] = '';
        }
      }
    });

    // формируем общий json
    newJsonData = { ...newDefaultJsonData, ...newLocaleJsonData };

    extractor
      ? extractor.getMessages().reduce((all, cur) => {
          // сканируем исходники и ищим по маркеру слова, если есть новые, то добавляем их в общий json
          if (cur.text && !newJsonData[cur.text]) {
            all[cur.text] = cur.text;
            newJsonData[cur.text] = cur.text;
          }

          return all;
        }, {})
      : {};

    // если язык не дефолт и у него перевод равен ключу, то сносим перевод
    Object.keys(newJsonData).forEach((key) => {
      if (newJsonData[key] === `Missing value for '${key}'`) {
        if (locale === defaultLocale) {
          newJsonData[key] = key;
        } else {
          newJsonData[key] = '';
        }
      }

      if (
        locale !== defaultLocale &&
        newLocaleJsonPoData[key] &&
        newLocaleJsonPoData[key] !== key
      ) {
        newJsonData[key] = newLocaleJsonPoData[key];
      }
      
      if (newJsonData[key] && (newJsonData[key] as string).includes('\\{')) {
        newJsonData[key] = (newJsonData[key] as string).split('\\{').join('{');
      }
      if (newJsonData[key] && (newJsonData[key] as string).includes('\\}')) {
        newJsonData[key] = (newJsonData[key] as string).split('\\}').join('}');
      }
      if (newJsonData[key] === key && locale !== defaultLocale) {
        newJsonData[key] = '';
      }
    });

    // если есть данные для сохранения то создаем по файл
    if (Object.keys(newJsonData).length > 0) {
      if (locale === defaultLocale) {
        i18nextToPot(locale, JSON.stringify(newJsonData, null, 4))
          .then((poContent) => {
            if (!existsSync(dirname(defaultPotFile))) {
              mkdirSync(dirname(defaultPotFile), { recursive: true });
            }
            if (!equal(newJsonData, localeJsonData) || resetUnusedTranslates) {
              writeFileSync(defaultPotFile, poContent.toString());
            }
          })
          .catch((err) => console.log(err));
      }

      i18nextToPo(locale, JSON.stringify(newJsonData, null, 4))
        .then((poContent) => {
          if (!existsSync(dirname(localePoFile))) {
            mkdirSync(dirname(localePoFile), { recursive: true });
          }
          if (!equal(newJsonData, localeJsonData) || resetUnusedTranslates) {
            writeFileSync(localePoFile, poContent.toString());
          }
        })
        .catch((err) => console.log(err));

      if (!existsSync(dirname(localeJsonFile))) {
        mkdirSync(dirname(localeJsonFile), { recursive: true });
      }
      if (!equal(newJsonData, localeJsonData) || resetUnusedTranslates) {
        writeFileSync(localeJsonFile, JSON.stringify(newJsonData, null, 4));
      }
    } else {
      if (existsSync(localeJsonFile)) {
        unlinkSync(localeJsonFile);
      }
      if (existsSync(localePoFile)) {
        unlinkSync(localePoFile);
      }
    }
  }
}
