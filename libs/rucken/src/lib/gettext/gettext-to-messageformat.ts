import {
  GetTextPoParserOptions,
  GetTextTranslations,
  mo,
  po,
} from 'gettext-parser';
/*
Examples from https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html

Note: true == 1, false == 0

Plural-Forms: nplurals=1; plural=0;
Plural-Forms: nplurals=2; plural=n != 1;
Plural-Forms: nplurals=2; plural=n>1;
Plural-Forms: nplurals=2; plural=n == 1 ? 0 : 1;
Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2;
Plural-Forms: nplurals=3; plural=n==1 ? 0 : n==2 ? 1 : 2;
Plural-Forms: nplurals=3; plural=n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2;
Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2;
Plural-Forms: nplurals=4; plural=n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3;
Plural-Forms: nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;
*/

const validPlural = (plural: string) => {
  const words = plural.match(/\b\w+\b/g);
  if (!words) return null;
  for (let i = 0; i < words.length; ++i) {
    const word = words[i];
    if (word !== 'n' && isNaN(Number(word))) return null;
  }
  return plural.trim();
};

const getPluralFunction = (pluralForms: string) => {
  if (!pluralForms) return null;
  let nplurals;
  let plural;
  pluralForms.split(';').forEach((part: string) => {
    const m = part.match(/^\s*(\w+)\s*=(.*)/);
    if (!m) return;
    switch (m[1]) {
      case 'nplurals':
        nplurals = Number(m[2]);
        break;
      case 'plural':
        plural = validPlural(m[2]);
        break;
    }
  });
  if (!nplurals || !plural)
    throw new Error('Invalid plural-forms: ' + pluralForms);
  const pluralFunc = new Function('n', `return 'p' + Number(${plural})`);
  (pluralFunc as any).cardinal = new Array(nplurals)
    .fill(' ')
    .map((_, i) => 'p' + i);
  return pluralFunc;
};

const defaultOptions = {
  defaultCharset: null,
  forceContext: false,
  pluralFunction: null,
  pluralVariablePattern: /%(?:\((\w+)\))?\w/,
  replacements: [
    // {
    //   pattern: /[\\{}#]/g,
    //   replacement: '\\$&',
    // },
    {
      pattern: /%(\d+)(?:\$\w)?/g,
      replacement: (_: any, n: number) => `{${n - 1}}`,
    },
    {
      pattern: /%\((\w+)\)\w/g,
      replacement: '{$1}',
    },
    {
      pattern: /%\w/g,
      replacement: function (this: { n: number }): string {
        return `{${this.n++}}`;
      },
      state: { n: 0 },
    },
    {
      pattern: /%%/g,
      replacement: '%',
    },
  ],
  verbose: false,
};

const getMessageFormat = (
  {
    pluralFunction,
    pluralVariablePattern,
    replacements,
    verbose,
  }: {
    pluralFunction: unknown;
    pluralVariablePattern: unknown;
    replacements: unknown;
    verbose: unknown;
  },
  {
    msgid,
    msgid_plural,
    msgstr,
  }: {
    msgid: string;
    msgid_plural?: string;
    msgstr: string[];
  },
) => {
  if (!msgid || !msgstr) return null;
  if (!msgstr[0]) {
    if (verbose) console.warn('Translation not found:', msgid);
    msgstr[0] = msgid;
  }
  if (msgid_plural) {
    if (!pluralFunction) throw new Error('Plural-Forms not defined');
    for (
      let i = 1;
      i < (pluralFunction as { cardinal: number[] }).cardinal.length;
      ++i
    ) {
      if (!msgstr[i]) {
        if (verbose) console.warn('Plural translation not found:', msgid, i);
        msgstr[i] = msgid_plural;
      }
    }
  }
  msgstr = msgstr.map((str: any) =>
    (
      replacements as Array<{
        pattern: RegExp;
        replacement: string | ((this: { n: number }) => string);
        state?: { n: number };
      }>
    ).reduce((str: string, { pattern, replacement, state }) => {
      if (state)
        replacement = (replacement as (...args: unknown[]) => string).bind(
          Object.assign({}, state),
        );
      return str.replace(pattern, replacement as string);
    }, str),
  );
  if (msgid_plural) {
    // @ts-expect-error - pluralVariablePattern might be undefined
    const m = msgid_plural.match(pluralVariablePattern!);
    const pv = (m && m[1]) || '0';
    const pc = (pluralFunction as { cardinal: number[] }).cardinal.map(
      (c: any, i: number) => `${c}{${msgstr[i]}}`,
    );
    return `{${pv}, plural, ${pc.join(' ')}}`;
  }
  return msgstr[0];
};

const convert = (
  parse: {
    (buffer: Buffer | string, defaultCharset?: string): GetTextTranslations;
    (
      buffer: Buffer | string,
      options?: GetTextPoParserOptions,
    ): GetTextTranslations;
    (arg0: any, arg1: any): { headers: any; translations: any };
  },
  input: any,
  options: {
    pluralFunction: any;
    forceContext?: any;
    pluralVariablePattern?: any;
    replacements?: any;
    verbose?: any;
  },
) => {
  options = Object.assign({}, defaultOptions, options);
  const { headers, translations } = parse(input, options);
  if (!options.pluralFunction) {
    options.pluralFunction = getPluralFunction(headers['Plural-Forms']);
  }
  let hasContext = false;
  for (const context in translations) {
    if (context) hasContext = true;
    const data = translations[context];
    for (const id in data) {
      const mf = getMessageFormat(
        options as {
          pluralFunction: unknown;
          pluralVariablePattern: unknown;
          replacements: unknown;
          verbose: unknown;
        },
        data[id],
      );
      if (mf) data[id] = mf;
      else delete data[id];
    }
  }
  return {
    headers,
    pluralFunction: options.pluralFunction,
    translations:
      hasContext || options.forceContext ? translations : translations[''],
  };
};

export function parseMo(input: unknown, options: Record<string, unknown>) {
  // @ts-expect-error - mo.parse function signature mismatch
  return convert(mo.parse.bind(mo), input, options || {});
}

export function parsePo(input: unknown, options: Record<string, unknown>) {
  // @ts-expect-error - po.parse function signature mismatch
  return convert(po.parse.bind(po), input, options || {});
}
