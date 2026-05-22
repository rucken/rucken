import { readFileSync, realpathSync } from 'fs';
import gettextParser from 'gettext-parser';
import { parsePo } from './gettext-to-messageformat';

export interface Po2JsonOptions {
  pretty?: boolean;
  fuzzy?: boolean;
  stringify?: boolean;
  format?: string;
  domain?: string;
  charset?: string;
  fullMF?: boolean;
  mfOptions?: Record<string, unknown>;
  'fallback-to-msgid'?: boolean;
}

interface TranslationEntry {
  msgid?: string;
  msgid_plural?: string;
  msgstr: string[];
  comments?: {
    flag?: string;
  };
}

interface ParsedPoData {
  headers: Record<string, string>;
  translations: Record<string, Record<string, TranslationEntry>>;
}

export function parse(buffer: Buffer, options?: Po2JsonOptions): unknown {
  // Setup options and load in defaults
  options = options || {};
  const defaults = {
    pretty: false,
    fuzzy: false,
    stringify: false,
    format: 'raw',
    domain: 'messages',
    charset: 'utf8',
    fullMF: false,
    mfOptions: {},
  };

  for (const property in defaults) {
    const key = property as keyof Po2JsonOptions;
    (options as Record<string, unknown>)[key] =
      'undefined' !== typeof options[key]
        ? options[key]
        : (defaults as Record<string, unknown>)[property];
  }

  let mfTranslations: unknown = {};
  let result: unknown;

  // defer to gettext-to-messageformat for the 'mf' format option
  // use all g2m default replacements except for:   pattern: /[\\{}#]/g, replacement: '\\$&'
  if (options.format === 'mf') {
    const poString = buffer.toString();
    // if the Plural-Forms header is missing, g2m needs a function or will throw an error
    const mfOptions = poString.includes('"Plural-Forms:')
      ? options.mfOptions
      : Object.assign(
          {},
          {
            pluralFunction: () => 0,
          },
          options.mfOptions,
        );
    result =
      Object.keys(mfOptions || {}).length > 0
        ? parsePo(buffer, mfOptions || {})
        : parsePo(buffer, {});

    if (options.fullMF) {
      return options.stringify
        ? // @ts-expect-error - JSON.stringify with undefined spacing
          JSON.stringify(result, options.pretty || false ? 3 : undefined)
        : result;
    }

    // simplify the output to only return the translations
    if (result) {
      const resultData = result as Record<string, unknown>;
      if (resultData['translations']) {
        const translations = resultData['translations'] as Record<
          string,
          Record<string, unknown>
        >;
        if (translations['']) {
          mfTranslations = translations[''];
          // include the default translations at the top level to keep compatibility as much as possible
          Object.keys(translations).forEach(function (context) {
            if (context === '') {
              Object.keys(translations['']).forEach(function (key) {
                (mfTranslations as Record<string, unknown>)[key] =
                  translations[''][key];
              });
            } else {
              (mfTranslations as Record<string, unknown>)[context] =
                translations[context];
            }
          });
        } else {
          mfTranslations = translations || {};
        }
      }
    }

    return options.stringify
      ? // @ts-expect-error - JSON.stringify with undefined spacing
        JSON.stringify(mfTranslations, options.pretty || false ? 3 : undefined)
      : (mfTranslations as Record<string, unknown>);
  }

  // Parse the PO file
  const parsed = gettextParser.po.parse(buffer) as ParsedPoData;

  // Create gettext/Jed compatible JSON from parsed data
  const contexts = parsed.translations;
  let resultRaw: Record<string, unknown> = {};

  Object.keys(contexts).forEach(function (context) {
    const translations = parsed.translations[context];
    const pluralForms = parsed.headers ? parsed.headers['plural-forms'] : '';

    Object.keys(translations).forEach(function (key) {
      const t = translations[key];
      const translationKey = context.length ? context + '\u0004' + key : key;
      const fuzzy =
        t.comments &&
        t.comments.flag &&
        t.comments.flag.match(/fuzzy/) !== null;

      if (!fuzzy || options?.fuzzy) {
        if (options?.format === 'jed') {
          resultRaw[translationKey] = [
            t.msgid_plural ? t.msgid_plural : null,
            ...(t as TranslationEntry).msgstr,
          ];
        } else {
          if (pluralForms === 'nplurals=1; plural=0;') {
            const msgstr = t.msgid_plural ? [t.msgstr] : t.msgstr;
            resultRaw[translationKey] = [
              t.msgid_plural ? t.msgid_plural : null,
              ...msgstr,
            ];
          } else {
            resultRaw[translationKey] = [
              t.msgid_plural ? t.msgid_plural : null,
              ...(t as TranslationEntry).msgstr,
            ];
          }
        }
      }

      // In the case of fuzzy or empty messages, use msgid(/msgid_plural)
      if (
        options?.['fallback-to-msgid'] &&
        ((fuzzy && !options?.fuzzy) || t.msgstr[0] === '')
      ) {
        resultRaw[translationKey] = [
          t.msgid_plural ? t.msgid_plural : null,
        ].concat(t.msgid_plural ? [key, t.msgid_plural] : [key]);
      }
    });
  });

  // Attach headers (overwrites any empty translation keys that may have somehow gotten in)
  if (parsed.headers) {
    resultRaw[''] = parsed.headers;
  }

  if (options.format === 'mf') {
    delete resultRaw[''];
  }

  // Make JSON fully Jed-compatible
  if ((options.format || '').indexOf('jed') === 0) {
    const jed: {
      domain: string | undefined;
      locale_data: Record<string, unknown>;
    } = {
      domain: options.domain,
      locale_data: {},
    };
    if (options.format === 'jed') {
      for (const key in resultRaw) {
        // eslint-disable-next-line no-prototype-builtins
        if (resultRaw.hasOwnProperty(key) && key !== '') {
          const entry = resultRaw[key] as unknown[];
          for (let i = 2; i < entry.length; i++) {
            if ('' === entry[i]) {
              entry[i] = entry[0];
            }
          }
          entry.shift();
        }
      }
    }
    const domain = options.domain || 'messages';
    jed.locale_data[domain] = resultRaw;
    (jed.locale_data[domain] as Record<string, unknown>)[''] = {
      domain: domain,
      plural_forms: (
        ((resultRaw[''] as Record<string, unknown>) || {}) as Record<
          string,
          unknown
        >
      )['plural-forms'],
      lang: (
        ((resultRaw[''] as Record<string, unknown>) || {}) as Record<
          string,
          unknown
        >
      )['language'],
    };

    resultRaw = jed as Record<string, unknown>;
  }

  return options.stringify
    ? // @ts-expect-error - JSON.stringify with undefined spacing
      JSON.stringify(resultRaw, options.pretty || false ? 3 : undefined)
    : resultRaw;
}

export function parseFileSync(
  fileName: string,
  options?: Po2JsonOptions,
): unknown {
  const data = readFileSync(realpathSync(fileName));

  return parse(data, options);
}
