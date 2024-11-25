import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('Extract-i18n (e2e)', () => {
  it('libs/feature-client', () => {
    let content = JSON.parse(
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/client/package.json'
        )
      ).toString()
    );
    expect(content.i18n).toMatchObject([
      {
        scope: 'feature-client',
        path: 'src/i18n',
        strategy: 'join',
      },
      {
        scope: 'feature-client-getText',
        path: 'src/i18n/getText',
        strategy: 'join',
      },
    ]);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/en.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'client feature transloco message!': 'client feature transloco message!',
      'FeatureClientUser Username': 'FeatureClientUser Username',
      'FeatureClientUser Password': 'FeatureClientUser Password',
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client feature transloco message!"
msgstr "client feature transloco message!"

msgid "FeatureClientUser Username"
msgstr "FeatureClientUser Username"

msgid "FeatureClientUser Password"
msgstr "FeatureClientUser Password"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/ru.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'client feature transloco message!': '',
      'FeatureClientUser Username': '',
      'FeatureClientUser Password': '',
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client feature transloco message!"
msgstr ""

msgid "FeatureClientUser Username"
msgstr ""

msgid "FeatureClientUser Password"
msgstr ""`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client feature transloco message!"
msgstr "client feature transloco message!"

msgid "FeatureClientUser Username"
msgstr "FeatureClientUser Username"

msgid "FeatureClientUser Password"
msgstr "FeatureClientUser Password"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('libs/feature-server', () => {
    const content = JSON.parse(
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/server/package.json'
        )
      ).toString()
    );
    expect(content.i18n).toMatchObject([
      {
        scope: 'feature-server',
        path: 'src/i18n',
        strategy: 'join',
      },
      {
        scope: 'feature-server-getText',
        path: 'src/i18n/getText',
        strategy: 'join',
      },
    ]);

    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/server/src/i18n/en.json'
        )
      )
    ).toBeFalsy();

    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/server/src/i18n/ru.json'
        )
      )
    ).toBeFalsy();
  });

  it('libs/feature-common', () => {
    const content = JSON.parse(
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/common/package.json'
        )
      ).toString()
    );
    expect(content.i18n).toMatchObject([
      {
        scope: 'feature-common',
        path: 'src/i18n',
        strategy: 'join',
      },
      {
        scope: 'feature-common-getText',
        path: 'src/i18n/getText',
        strategy: 'join',
      },
    ]);

    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/feature/common/src/i18n/en.json'
        )
      )
    ).toBeFalsy();
  });

  //

  it('apps/client', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/en.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'client transloco message!': 'client transloco message!',
      Username: 'Username',
      Password: 'Password',
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/en.vendor.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'feature-client': {
        'FeatureClientUser Id': 'FeatureClientUser Id',
      },
      'feature-common': {
        'FeatureCommonUser Id': 'FeatureCommonUser Id',
        'FeatureCommonUser Password': 'FeatureCommonUser Password',
        'FeatureCommonUser Username': 'FeatureCommonUser Username',
      },
      'feature-client-getText': {
        'FeatureClientUser Id': 'FeatureClientUser Id',
      },
      'feature-common-getText': {
        'FeatureCommonUser Id': 'FeatureCommonUser Id',
        'FeatureCommonUser Password': 'FeatureCommonUser Password',
        'FeatureCommonUser Username': 'FeatureCommonUser Username',
      },
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client transloco message!"
msgstr "client transloco message!"

msgid "Username"
msgstr "Username"

msgid "Password"
msgstr "Password"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/ru.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'client transloco message!': '',
      Username: '',
      Password: '',
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/ru.vendor.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'feature-client-getText': {
        'FeatureClientUser Id': '',
      },
      'feature-common-getText': {
        'FeatureCommonUser Id': '',
        'FeatureCommonUser Password': '',
        'FeatureCommonUser Username': '',
      },
      'feature-client': {
        'client feature transloco message!': '',
        'FeatureClientUser Username': '',
        'FeatureClientUser Password': '',
      },
      'feature-common': {},
    });

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client transloco message!"
msgstr ""

msgid "Username"
msgstr ""

msgid "Password"
msgstr ""`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/client/src/assets/i18n/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "client transloco message!"
msgstr "client transloco message!"

msgid "Username"
msgstr "Username"

msgid "Password"
msgstr "Password"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('apps/server', () => {
    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/server/src/assets/i18n/en.json'
        )
      )
    ).toBeFalsy();

    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/en.vendor.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'feature-common': {
        'FeatureCommonUser Id': 'FeatureCommonUser Id',
        'FeatureCommonUser Password': 'FeatureCommonUser Password',
        'FeatureCommonUser Username': 'FeatureCommonUser Username',
      },
      'feature-server': {
        'FeatureServerUser Id': 'FeatureServerUser Id',
      },
      'feature-common-getText': {
        'FeatureCommonUser Id': 'FeatureCommonUser Id',
        'FeatureCommonUser Password': 'FeatureCommonUser Password',
        'FeatureCommonUser Username': 'FeatureCommonUser Username',
      },
      'feature-server-getText': {
        'FeatureServerUser Id': 'FeatureServerUser Id',
      },
    });

    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/server/src/assets/i18n/ru.json'
        )
      )
    ).toBeFalsy();

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/ru.vendor.json'
      )
    ).toString();
    expect(JSON.parse(content)).toMatchObject({
      'feature-common-getText': {
        'FeatureCommonUser Id': '',
      },
      'feature-server-getText': {
        'FeatureServerUser Id': '',
      },
      'feature-common': {},
      'feature-server': {},
    });
  });

  it('apps/cli', () => {
    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/cli/src/assets/i18n/en.json'
        )
      )
    ).toBeFalsy();

    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/cli/src/assets/i18n/ru.json'
        )
      )
    ).toBeFalsy();
  });
});
