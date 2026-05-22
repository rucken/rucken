import { po, mo } from 'gettext-parser';
// @ts-expect-error - No type definitions available for gettext-converter
import { i18next2js } from 'gettext-converter';

export function i18nextToPo(
  locale: string,
  body: string | Buffer,
  options = {},
): Promise<Buffer> {
  return i18nextToGettext(locale, body.toString('utf8'), po, options);
}

export function i18nextToPot(
  locale: string,
  body: string | Buffer,
  options = {},
): Promise<Buffer> {
  return i18nextToGettext(locale, body.toString('utf8'), po, options);
}

export function i18nextToMo(
  locale: string,
  body: string | Buffer,
  options = {},
): Promise<Buffer> {
  return i18nextToGettext(locale, body.toString('utf8'), mo, options);
}

function i18nextToGettext(
  locale: any,
  body: { toString: (arg0: string) => any },
  parser: {
    compile: (
      arg0: any,
      arg1: { foldLength?: undefined } | { foldLength: any },
    ) => any;
  },
  options: { foldLength?: any; project?: any },
) {
  const parserOptions =
    options.foldLength === undefined ? {} : { foldLength: options.foldLength };

  return Promise.resolve(
    parser.compile(
      i18next2js(
        locale,
        // i18next2js does not support buffers
        Buffer.isBuffer(body) ? body.toString('utf8') : body,
        {
          ...options,
          project: options.project ?? 'i18next-conv',
          setLocaleAsLanguageHeader: false,
        },
      ),
      parserOptions,
    ),
  );
}
