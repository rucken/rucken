import { readFileSync } from 'fs';
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
    expect(content).toEqual(`{
  "client feature transloco message!": "client feature transloco message!",
  "FeatureClientUser Username": "FeatureClientUser Username",
  "FeatureClientUser Password": "FeatureClientUser Password"
}
`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "client feature transloco message!"
msgstr "client feature transloco message!"

msgid "FeatureClientUser Username"
msgstr "FeatureClientUser Username"

msgid "FeatureClientUser Password"
msgstr "FeatureClientUser Password"`);

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
    expect(content).toEqual(`{
  "client feature transloco message!": "",
  "FeatureClientUser Username": "",
  "FeatureClientUser Password": ""
}
`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "client feature transloco message!"
msgstr ""

msgid "FeatureClientUser Username"
msgstr ""

msgid "FeatureClientUser Password"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "client feature transloco message!"
msgstr "client feature transloco message!"

msgid "FeatureClientUser Username"
msgstr "FeatureClientUser Username"

msgid "FeatureClientUser Password"
msgstr "FeatureClientUser Password"`);
  });

  it('libs/feature-server', () => {
    let content = JSON.parse(
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

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/i18n/en.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/i18n/ru.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);
  });

  it('libs/feature-common', () => {
    let content = JSON.parse(
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

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/common/src/i18n/en.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/common/src/i18n/ru.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);
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
    expect(content).toEqual(`{
  "client transloco message!": "client transloco message!",
  "Username": "Username",
  "Password": "Password"
}
`);

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
    expect(content).toEqual(`{
  "feature-client": {
    "FeatureClientUser Id": "FeatureClientUser Id"
  },
  "feature-common": {
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
  },
  "feature-client-getText": {
    "FeatureClientUser Id": "FeatureClientUser Id"
  },
  "feature-common-getText": {
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
  }
}
`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "client transloco message!"
msgstr "client transloco message!"

msgid "Username"
msgstr "Username"

msgid "Password"
msgstr "Password"`);

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
    expect(content).toEqual(`{
  "client transloco message!": "",
  "Username": "",
  "Password": ""
}
`);

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
    expect(content).toEqual(`{
  "feature-client-getText": {
    "FeatureClientUser Id": ""
  },
  "feature-common-getText": {
    "FeatureCommonUser Id": "",
    "FeatureCommonUser Password": "",
    "FeatureCommonUser Username": ""
  },
  "feature-client": {
    "client feature transloco message!": "",
    "FeatureClientUser Username": "",
    "FeatureClientUser Password": ""
  },
  "feature-common": {}
}
`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "client transloco message!"
msgstr ""

msgid "Username"
msgstr ""

msgid "Password"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "client transloco message!"
msgstr "client transloco message!"

msgid "Username"
msgstr "Username"

msgid "Password"
msgstr "Password"`);
  });

  it('apps/server', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/en.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/en.vendor.json'
      )
    ).toString();
    expect(content).toEqual(`{
  "feature-common": {
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
  },
  "feature-server": {
    "FeatureServerUser Id": "FeatureServerUser Id",
    "FeatureServerUser Password": "FeatureServerUser Password",
    "FeatureServerUser Username": "FeatureServerUser Username"
  },
  "feature-common-getText": {
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
  },
  "feature-server-getText": {
    "FeatureServerUser Id": "FeatureServerUser Id",
    "FeatureServerUser Password": "FeatureServerUser Password",
    "FeatureServerUser Username": "FeatureServerUser Username"
  }
}
`);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/ru.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);

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
    expect(content).toEqual(`{
  "feature-common-getText": {
    "FeatureCommonUser Id": "",
    "FeatureCommonUser Password": "",
    "FeatureCommonUser Username": ""
  },
  "feature-server-getText": {
    "FeatureServerUser Id": "",
    "FeatureServerUser Password": "",
    "FeatureServerUser Username": ""
  },
  "feature-common": {},
  "feature-server": {}
}
`);
  });

  it('apps/cli', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/cli/src/assets/i18n/en.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);

    content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/cli/src/assets/i18n/ru.json'
      )
    ).toString();
    expect(content).toEqual(`{}
`);
  });
});
