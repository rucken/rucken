/* eslint-disable @typescript-eslint/no-explicit-any */
import { po, mo } from 'gettext-parser';
import { i18next2js } from 'gettext-converter';

export function i18nextToPo(locale, body, options = {}) {
  return i18nextToGettext(locale, body, po, options);
}

export function i18nextToPot(locale, body, options = {}) {
  return i18nextToGettext(locale, body, po, options);
}

export function i18nextToMo(locale, body, options = {}) {
  return i18nextToGettext(locale, body, mo, options);
}

function i18nextToGettext(
  locale: any,
  body: { toString: (arg0: string) => any },
  parser: {
    compile: (
      arg0: any,
      arg1: { foldLength?: undefined } | { foldLength: any }
    ) => any;
  },
  options: { foldLength?: any; project?: any }
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
        }
      ),
      parserOptions
    )
  );
}
