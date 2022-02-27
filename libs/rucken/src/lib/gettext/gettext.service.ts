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
  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(`${GettextService.name}: ${command}`);
    this.logger.level = 'all';
  }

  public extractTranslatesFromSourcesForLibraries({
    po2jsonOptions,
    pattern,
    locales,
    defaultLocale,
    markers,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    po2jsonOptions: Record<string, any>;
    pattern: string;
    locales: string[];
    defaultLocale: string;
    markers: string[];
  }): void {
    this.logger.info('Start create translate files...');
    this.logger.info(
      `Config: ${JSON.stringify({
        po2jsonOptions,
        pattern,
        locales,
        defaultLocale,
        markers,
      })}`
    );
    try {
      const projects = this.utilsService.getWorkspaceProjects();
      Object.keys(projects)
        //.filter((projectName) => workspaceJson.projects[projectName].projectType === 'library')
        .forEach((projectName) => {
          this.logger.debug(projectName, projects[projectName].sourceRoot);
          const assetsPath =
            projects[projectName].projectType === 'application' ? 'assets' : '';
          locales.forEach((locale) => {
            this.processLibrary({
              po2jsonOptions,
              pattern,
              sourceRoot: projects[projectName].sourceRoot,
              defaultLocale,
              marker: '',
              locale,
              assetsPath,
            });
            markers.forEach((marker) =>
              this.processLibrary({
                po2jsonOptions,
                pattern,
                sourceRoot: projects[projectName].sourceRoot,
                defaultLocale,
                marker,
                locale,
                assetsPath,
              })
            );
          });
        });
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
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    po2jsonOptions: Record<string, any>;
    pattern: string;
    sourceRoot: string;
    defaultLocale: string;
    marker?: string;
    locale?: string;
    assetsPath?: string;
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

    // считываем пот файл
    if (existsSync(defaultJsonFile)) {
      newDefaultJsonData = {
        ...defaultJsonData,
        ...parseFileSync(defaultJsonFile, po2jsonOptions),
      };
    }

    // считываем по файл локали
    if (existsSync(localePoFile)) {
      newLocaleJsonData = {
        ...localeJsonData,
        ...parseFileSync(localePoFile, po2jsonOptions),
      };
    }

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
            if (!equal(newJsonData, localeJsonData)) {
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
          if (!equal(newJsonData, localeJsonData)) {
            writeFileSync(localePoFile, poContent.toString());
          }
        })
        .catch((err) => console.log(err));

      if (!existsSync(dirname(localeJsonFile))) {
        mkdirSync(dirname(localeJsonFile), { recursive: true });
      }
      if (!equal(newJsonData, localeJsonData)) {
        writeFileSync(localeJsonFile, JSON.stringify(newJsonData, null, 4));
      }
    } else {
      if (existsSync(localeJsonFile)) {
        unlinkSync(localeJsonFile);
      }
      if (existsSync(localePoFile)) {
        unlinkSync(localePoFile);
      }
      if (existsSync(localeJsonFile)) {
        unlinkSync(localeJsonFile);
      }
    }
  }
}
