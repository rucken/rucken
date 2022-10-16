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

@Injectable()
export class CopyPasteService {
  public static title = 'copy-paste';

  private logger: Logger;
  private dictionaries: { from: string; to: string }[];

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
      if (destPath && destPath[0] === '/' && path[0] !== '/') {
        destPath = resolve(join(dirname(path), basename(destPath)));
      } else {
        if (!destPath || !existsSync(resolve(destPath))) {
          destPath = resolve(path);
        }
      }
    }
    extensions = extensions.map((extension) => extension.toUpperCase());
    path = resolve(path);
    let files = await recursive(path);
    files = sortPaths(files, sep);
    for (let findex = 0; findex < files.length; findex++) {
      const file = files[findex];
      const fileExt = file.split('.').pop().toUpperCase();
      if (extensions.includes(fileExt)) {
        const destFile = this.replace({
          text: file.replace(path, destPath),
          find,
          findPlural,
          replace,
          replacePlural,
          cases,
        });

        const content = readFileSync(file).toString();
        const destContent = this.replace({
          text: content,
          find,
          findPlural,
          replace,
          replacePlural,
          cases,
        });

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
  }: {
    text: string;
    find: string;
    findPlural: string;
    replace: string;
    replacePlural: string;
    cases: string[];
  }) {
    if (!this.dictionaries) {
      this.dictionaries = [];
      const functions = [
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
      // plural
      for (let index = 0; index < functions.length; index++) {
        const func = (
          string: string,
          options?: {
            keepSpecialCharacters?: boolean;
            keep?: string[];
          }
        ) => functions[index](camelCase(string), options);

        const from = func(findPlural, { keepSpecialCharacters: true });
        const to = func(replacePlural, { keepSpecialCharacters: true });
        if (!this.dictionaries.find((d) => d.from === from)) {
          this.dictionaries.push({ from, to });
        }
      }
      // singular
      for (let index = 0; index < functions.length; index++) {
        const func = (
          string: string,
          options?: {
            keepSpecialCharacters?: boolean;
            keep?: string[];
          }
        ) => functions[index](camelCase(string), options);

        const from = func(find, { keepSpecialCharacters: true });
        const to = func(replace, { keepSpecialCharacters: true });
        if (!this.dictionaries.find((d) => d.from === from)) {
          this.dictionaries.push({ from, to });
        }
      }
      this.logger.debug(`dictionaries: ${JSON.stringify(this.dictionaries)}`);
    }
    let newText = text;
    for (let index = 0; index < this.dictionaries.length; index++) {
      const dictionary = this.dictionaries[index];
      newText = newText.replace(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          dictionary.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          'g'
        ),
        dictionary.to
      );
    }
    return newText;
  }
}
