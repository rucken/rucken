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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';
import { basename, dirname, join, resolve, sep } from 'path';
import pluralize from 'pluralize';
import recursive from 'recursive-readdir';
import sortPaths from 'sort-paths';
import { UtilsService } from '../utils/utils.service';
import { createHash } from 'crypto';

@Injectable()
export class CopyPasteService {
  public static title = 'copy-paste';

  private logger: Logger;

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
  }: {
    path?: string;
    find: string;
    findPlural?: string;
    replace: string;
    replacePlural?: string;
    destPath?: string;
    extensions: string[];
    cases: string[];
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
  }: {
    path?: string;
    find: string;
    findPlural?: string;
    replace: string;
    replacePlural?: string;
    destPath?: string;
    extensions: string[];
    cases: string[];
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
        if (!destPath || !existsSync(resolve(destPath))) {
          destPath = resolve(path);
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
    let files = await recursive(path);
    files = sortPaths(files, sep);

    for (const file of files) {
      const fileExt = file.split('.').pop().toUpperCase();
      if (extensions.includes(fileExt)) {
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

    // create md5 hash for replaced string
    for (const allResultReplacedText of allResultReplacedTexts) {
      allResultReplacedText.toMd5 = createHash('md5')
        .update(allResultReplacedText.to)
        .digest('hex');
    }

    // replace content
    for (const file of files) {
      const fileExt = file.split('.').pop().toUpperCase();
      if (extensions.includes(fileExt)) {
        for (const allResultReplacedText of allResultReplacedTexts) {
          destPath = destPath.replace(
            new RegExp(allResultReplacedText.from, 'g'),
            allResultReplacedText.toMd5
          );
        }

        const { newText: destFile } = this.replace({
          text: file.replace(path, destPath),
          find,
          findPlural,
          replace,
          replacePlural,
          cases,
          mode: 'filepath',
        });

        for (const allResultReplacedText of allResultReplacedTexts) {
          destPath = destPath.replace(
            new RegExp(allResultReplacedText.toMd5, 'g'),
            allResultReplacedText.to
          );
        }

        let content = readFileSync(file).toString();
        for (const allResultReplacedText of allResultReplacedTexts) {
          content = content.replace(
            new RegExp(`${sep}${allResultReplacedText.from}`, 'g'),
            allResultReplacedText.toMd5
          );
        }

        let { newText: destContent } = this.replace({
          text: content,
          find,
          findPlural,
          replace,
          replacePlural,
          cases,
          mode: 'content',
        });

        for (const allResultReplacedText of allResultReplacedTexts) {
          destContent = destContent.replace(
            new RegExp(allResultReplacedText.toMd5, 'g'),
            `${sep}${allResultReplacedText.to}`
          );
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
    const resultReplacedTexts: { from: string; to: string }[] = [];
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

      const replacedText = newText.replace(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          'g'
        ),
        to
      );
      if (newText !== replacedText) {
        resultReplacedTexts.push({ from, to });
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

      const replacedText = newText.replace(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          'g'
        ),
        to
      );
      if (newText !== replacedText) {
        resultReplacedTexts.push({ from, to });
      }
      newText = replacedText;
    }
    return { newText, resultReplacedTexts };
  }
}
