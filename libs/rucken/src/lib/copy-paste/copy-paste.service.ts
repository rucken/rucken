import { Injectable } from '@nestjs/common';
import {
  adaCase,
  camelCase,
  capitalCase,
  cobolCase,
  constantCase,
  dotNotation,
  kebabCase,
  lowerCase,
  pascalCase,
  pathCase,
  snakeCase,
  spaceCase,
  trainCase,
  upperCamelCase,
  upperCase,
} from 'case-anything';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { basename, dirname, join, resolve, sep } from 'path';
import pluralize from 'pluralize';
import recursive from 'recursive-readdir';
import sortPaths from 'sort-paths';
import { UtilsService } from '../utils/utils.service';
import { glob } from 'glob';

@Injectable()
export class CopyPasteService {
  public static title = 'copy-paste';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  async copyPasteHandler({
    path,
    find,
    findPlural,
    replace,
    replacePlural,
    destPath,
    extensions,
    cases,
    globRules,
    replaceEnvs,
  }: {
    path?: string;
    find: string;
    findPlural?: string;
    replace: string;
    replacePlural?: string;
    destPath?: string;
    extensions: string[];
    cases: string[];
    globRules?: string;
    replaceEnvs?: string;
  }) {
    this.logger.info('Start copy past files...');
    this.logger.debug(
      `Config: ${JSON.stringify({
        path,
        find,
        findPlural,
        replace,
        replacePlural,
        destPath,
        extensions,
        cases,
        globRules,
        replaceEnvs,
      })}`
    );

    await this.process({
      path,
      find,
      findPlural,
      replace,
      replacePlural,
      destPath,
      extensions,
      cases,
      globRules,
      replaceEnvs,
    });

    this.logger.info('End of copy paste files...');
  }

  private async process({
    path,
    find,
    findPlural,
    replace,
    replacePlural,
    destPath,
    extensions,
    cases,
    globRules,
    replaceEnvs,
  }: {
    path?: string;
    find: string;
    findPlural?: string;
    replace: string;
    replacePlural?: string;
    destPath?: string;
    extensions: string[];
    cases: string[];
    globRules?: string;
    replaceEnvs?: string;
  }) {
    if (!findPlural) {
      findPlural = pluralize(find);
    }
    if (!replacePlural) {
      replacePlural = pluralize(replace);
    }
    if (!path) {
      path = '.';
    }
    if (destPath && destPath[0] === '.' && path[0] !== '.') {
      destPath = resolve(join(destPath, basename(path)));
    } else {
      if (destPath && destPath[0] === sep && path[0] !== sep) {
        destPath = resolve(join(dirname(path), basename(destPath)));
      } else {
        if (
          destPath?.startsWith('.') &&
          dirname(destPath) == dirname(path) &&
          destPath !== path
        ) {
          destPath = resolve(destPath);
        } else {
          if (!destPath || !existsSync(resolve(destPath))) {
            destPath = resolve(path);
          }
        }
      }
    }
    extensions = extensions.map((extension) => extension.toUpperCase());
    path = resolve(path);

    let allResultReplacedTexts: {
      from: string;
      to: string;
      toMd5?: string;
    }[] = [];

    // collect all filepaths
    let files = globRules
      ? await glob(join(path, globRules))
      : await recursive(path);
    files = sortPaths(files, sep);

    allResultReplacedTexts = this.collectFilepaths(
      files,
      extensions,
      path,
      destPath,
      find,
      findPlural,
      replace,
      replacePlural,
      cases,
      allResultReplacedTexts
    );

    // replace content
    for (let file of files) {
      file = file.split(sep).join('/');
      const fileExt = file.split('.').pop().toUpperCase();
      if (extensions[0] === '*' || extensions.includes(fileExt)) {
        let { destFile } = this.getDestFile(
          allResultReplacedTexts,
          destPath,
          file,
          path,
          find,
          findPlural,
          replace,
          replacePlural,
          cases
        );

        const content = readFileSync(file).toString();

        let destContent = this.getDestContent(
          content,
          allResultReplacedTexts,
          find,
          findPlural,
          replace,
          replacePlural,
          cases
        );

        console.log(process.env);
        console.log({ replaceEnvs });
        if (replaceEnvs) {
          const findStrings = Object.entries(process.env).map(([key]) =>
            replaceEnvs.replace('key', key)
          );
          const replaceStrings = Object.entries(process.env).map(
            ([key, value]) => this.utilsService.replaceEnv(value)
          );

          for (let index = 0; index < findStrings.length; index++) {
            const findString = findStrings[index];
            const replaceString = replaceStrings[index];
            destFile = destFile.split(findString).join(replaceString);
            destContent = destContent.split(findString).join(replaceString);
          }
        }

        if (file !== destFile) {
          this.logger.log(
            `${file}(${content.length}) => ${destFile}(${destContent.length})`
          );
          if (!existsSync(dirname(destFile))) {
            mkdirSync(dirname(destFile), { recursive: true });
          }
          writeFileSync(destFile, destContent);
        }
      }
    }
  }

  private getDestContent(
    content: string,
    allResultReplacedTexts: { from: string; to: string; toMd5?: string }[],
    find: string,
    findPlural: string,
    replace: string,
    replacePlural: string,
    cases: string[]
  ) {
    let destContent = content;
    // first we should replace all paths
    for (const allResultReplacedText of allResultReplacedTexts) {
      destContent = destContent.replace(
        new RegExp(`${sep}${allResultReplacedText.from}`, 'g'),
        `${sep}${allResultReplacedText.toMd5}`
      );
    }

    // collect replace markers
    const result = this.replace({
      text: destContent,
      find,
      findPlural,
      replace,
      replacePlural,
      cases,
      mode: 'content',
    });
    destContent = result.newText;
    const resultReplacedTexts = result.resultReplacedTexts;

    // replace all markers to replaced text for paths
    for (const allResultReplacedText of allResultReplacedTexts) {
      destContent = destContent.replace(
        new RegExp(`${sep}${allResultReplacedText.toMd5}`, 'g'),
        `${sep}${allResultReplacedText.to}`
      );
    }
    // replace all markers to replaced text for content
    for (const allResultReplacedText of allResultReplacedTexts) {
      destContent = destContent.replace(
        new RegExp(allResultReplacedText.toMd5, 'g'),
        allResultReplacedText.to
      );
    }
    // replace markers to replaced text for content
    for (const allResultReplacedText of resultReplacedTexts) {
      destContent = destContent.replace(
        new RegExp(allResultReplacedText.toMd5, 'g'),
        allResultReplacedText.to
      );
    }
    return destContent;
  }

  private getDestFile(
    allResultReplacedTexts: { from: string; to: string; toMd5?: string }[],
    destPath: string,
    file: string,
    path: string,
    find: string,
    findPlural: string,
    replace: string,
    replacePlural: string,
    cases: string[]
  ) {
    for (const allResultReplacedText of allResultReplacedTexts) {
      destPath = destPath.replace(
        new RegExp(`${sep}${allResultReplacedText.from}`, 'g'),
        `${sep}${allResultReplacedText.toMd5}`
      );
    }

    const result = this.replace({
      text: file.replace(path, destPath),
      find,
      findPlural,
      replace,
      replacePlural,
      cases,
      mode: 'filepath',
    });
    const filesResultReplacedTexts = result.resultReplacedTexts;
    let destFile = result.newText;

    for (const allResultReplacedText of allResultReplacedTexts) {
      destPath = destPath.replace(
        new RegExp(`${sep}${allResultReplacedText.toMd5}`, 'g'),
        `${sep}${allResultReplacedText.to}`
      );
    }
    for (const allResultReplacedText of filesResultReplacedTexts) {
      destFile = destFile.replace(
        new RegExp(allResultReplacedText.toMd5, 'g'),
        allResultReplacedText.to
      );
    }
    return { destFile };
  }

  private collectFilepaths(
    files: string[],
    extensions: string[],
    path: string,
    destPath: string,
    find: string,
    findPlural: string,
    replace: string,
    replacePlural: string,
    cases: string[],
    allResultReplacedTexts: {
      from: string;
      to: string;
      toMd5?: string;
    }[]
  ) {
    for (let file of files) {
      file = file.split(sep).join('/');
      const fileExt = file.split('.').pop().toUpperCase();
      if (extensions[0] === '*' || extensions.includes(fileExt)) {
        const { resultReplacedTexts } = this.replace({
          text: file.replace(path, destPath),
          find,
          findPlural,
          replace,
          replacePlural,
          cases,
          mode: 'filepath',
        });
        allResultReplacedTexts = [
          ...allResultReplacedTexts,
          ...resultReplacedTexts,
        ];
      }
    }
    return allResultReplacedTexts;
  }

  replace({
    text,
    find,
    findPlural,
    replace,
    replacePlural,
    cases,
    mode,
  }: {
    text: string;
    find: string;
    findPlural: string;
    replace: string;
    replacePlural: string;
    cases: string[];
    mode: 'content' | 'filepath';
  }) {
    let newText = text;
    const functions =
      mode === 'filepath'
        ? [
            //🥙 kebab-case
            cases.includes('kebabCase') ? kebabCase : undefined,
          ]
        : [
            // 🐪 camelCase
            cases.includes('camelCase') ? camelCase : undefined,
            // 🐫 PascalCase
            cases.includes('pascalCase') ? pascalCase : undefined,
            // 🐫 UpperCamelCase
            cases.includes('upperCamelCase') ? upperCamelCase : undefined,
            //🥙 kebab-case
            cases.includes('kebabCase') ? kebabCase : undefined,
            // 🐍 snake_case
            cases.includes('snakeCase') ? snakeCase : undefined,
            // 📣 CONSTANT_CASE
            cases.includes('constantCase') ? constantCase : undefined,
            // 🚂 Train-Case
            cases.includes('trainCase') ? trainCase : undefined,
            // 🕊 Ada_Case
            cases.includes('adaCase') ? adaCase : undefined,
            // 👔 COBOL-CASE
            cases.includes('cobolCase') ? cobolCase : undefined,
            // 📍 Dot.notation
            cases.includes('dotNotation') ? dotNotation : undefined,
            // 📂 Path/case
            cases.includes('pathCase') ? pathCase : undefined,
            // 🛰 Space case
            cases.includes('spaceCase') ? spaceCase : undefined,
            // 🏛 Capital Case
            cases.includes('capitalCase') ? capitalCase : undefined,
            // 🔡 lower case
            cases.includes('lowerCase') ? lowerCase : undefined,
            // 🔠 UPPER CASE
            cases.includes('upperCase') ? upperCase : undefined,
          ].filter(Boolean);
    const resultReplacedTexts: { from: string; to: string; toMd5: string }[] =
      [];
    // plural
    for (const item of functions) {
      const func = (
        string: string,
        options?: {
          keepSpecialCharacters?: boolean;
          keep?: string[];
        }
      ) =>
        mode === 'filepath'
          ? item(string, options)
          : item(camelCase(string), options);

      const from = func(findPlural, { keepSpecialCharacters: true });
      const to = func(replacePlural, { keepSpecialCharacters: true });
      const toMd5 = createHash('md5').update(to).digest('hex');

      const replacedText = newText.replace(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          'g'
        ),
        toMd5
      );
      if (newText !== replacedText) {
        resultReplacedTexts.push({ from, to, toMd5 });
      }
      newText = replacedText;
    }
    // singular
    for (const item of functions) {
      const func = (
        string: string,
        options?: {
          keepSpecialCharacters?: boolean;
          keep?: string[];
        }
      ) =>
        mode === 'filepath'
          ? item(string, options)
          : item(camelCase(string), options);

      const from = func(find, { keepSpecialCharacters: true });
      const to = func(replace, { keepSpecialCharacters: true });
      const toMd5 = createHash('md5').update(to).digest('hex');

      const replacedText = newText.replace(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          'g'
        ),
        toMd5
      );
      if (newText !== replacedText) {
        resultReplacedTexts.push({ from, to, toMd5 });
      }
      newText = replacedText;
    }
    return { newText, resultReplacedTexts };
  }
}
