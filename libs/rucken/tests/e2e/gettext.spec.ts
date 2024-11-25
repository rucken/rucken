import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Gettext (e2e)', () => {
  it('libs/feature-client', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureClientUser Id": "FeatureClientUser Id"
}`
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
        'integrations/app/libs/feature/client/src/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureClientUser Id"
msgstr "FeatureClientUser Id"`
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
        'integrations/app/libs/feature/client/src/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureClientUser Id": ""
}`
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
        'integrations/app/libs/feature/client/src/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureClientUser Id"
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
        'integrations/app/libs/feature/client/src/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureClientUser Id"
msgstr "FeatureClientUser Id"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('libs/feature-server', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureServerUser 'Password'": "FeatureServerUser 'Password'",
    "FeatureServerUser \\"Username\\"": "FeatureServerUser \\"Username\\"",
    "FeatureServerUser Id": "FeatureServerUser Id"
}`
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
        'integrations/app/libs/feature/server/src/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureServerUser 'Password'"
msgstr "FeatureServerUser 'Password'"

msgid "FeatureServerUser \\"Username\\""
msgstr "FeatureServerUser \\"Username\\""

msgid "FeatureServerUser Id"
msgstr "FeatureServerUser Id"`
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
        'integrations/app/libs/feature/server/src/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureServerUser 'Password'": "",
    "FeatureServerUser \\"Username\\"": "",
    "FeatureServerUser Id": ""
}`
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
        'integrations/app/libs/feature/server/src/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureServerUser 'Password'"
msgstr ""

msgid "FeatureServerUser \\"Username\\""
msgstr ""

msgid "FeatureServerUser Id"
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
        'integrations/app/libs/feature/server/src/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureServerUser 'Password'"
msgstr "FeatureServerUser 'Password'"

msgid "FeatureServerUser \\"Username\\""
msgstr "FeatureServerUser \\"Username\\""

msgid "FeatureServerUser Id"
msgstr "FeatureServerUser Id"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('libs/feature-common', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/common/src/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
}`
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
        'integrations/app/libs/feature/common/src/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureCommonUser Id"
msgstr "FeatureCommonUser Id"

msgid "FeatureCommonUser Password"
msgstr "FeatureCommonUser Password"

msgid "FeatureCommonUser Username"
msgstr "FeatureCommonUser Username"`
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
        'integrations/app/libs/feature/common/src/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "FeatureCommonUser Id": "",
    "FeatureCommonUser Password": "",
    "FeatureCommonUser Username": ""
}`
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
        'integrations/app/libs/feature/common/src/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureCommonUser Id"
msgstr ""

msgid "FeatureCommonUser Password"
msgstr ""

msgid "FeatureCommonUser Username"
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
        'integrations/app/libs/feature/common/src/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "FeatureCommonUser Id"
msgstr "FeatureCommonUser Id"

msgid "FeatureCommonUser Password"
msgstr "FeatureCommonUser Password"

msgid "FeatureCommonUser Username"
msgstr "FeatureCommonUser Username"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
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
        'integrations/app/apps/client/src/assets/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "Id": "Id"
}`
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
        'integrations/app/apps/client/src/assets/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "Id"
msgstr "Id"`
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
        'integrations/app/apps/client/src/assets/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "Id": ""
}`
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
        'integrations/app/apps/client/src/assets/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "Id"
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
        'integrations/app/apps/client/src/assets/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "Id"
msgstr "Id"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('apps/server', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/server/src/assets/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "ServerUser Id": "ServerUser Id",
    "ServerUser Username": "ServerUser Username",
    "ServerUserPassword": "ServerUserPassword"
}`
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
        'integrations/app/apps/server/src/assets/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "ServerUser Id"
msgstr "ServerUser Id"

msgid "ServerUser Username"
msgstr "ServerUser Username"

msgid "ServerUserPassword"
msgstr "ServerUserPassword"`
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
        'integrations/app/apps/server/src/assets/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "ServerUser Id": "",
    "ServerUser Username": "",
    "ServerUserPassword": ""
}`
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
        'integrations/app/apps/server/src/assets/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "ServerUser Id"
msgstr ""

msgid "ServerUser Username"
msgstr ""

msgid "ServerUserPassword"
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
        'integrations/app/apps/server/src/assets/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "ServerUser Id"
msgstr "ServerUser Id"

msgid "ServerUser Username"
msgstr "ServerUser Username"

msgid "ServerUserPassword"
msgstr "ServerUserPassword"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });

  it('apps/cli', () => {
    let content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/apps/cli/src/assets/i18n/getText/en.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "CliUser {{Username}}": "CliUser {{Username}}",
    "CliUser Id": "CliUser Id",
    "CliUser Password": "CliUser Password"
}`
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
        'integrations/app/apps/cli/src/assets/i18n/getText/en.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "CliUser {{Username}}"
msgstr "CliUser {{Username}}"

msgid "CliUser Id"
msgstr "CliUser Id"

msgid "CliUser Password"
msgstr "CliUser Password"`
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
        'integrations/app/apps/cli/src/assets/i18n/getText/ru.json'
      )
    ).toString();
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `{
    "CliUser {{Username}}": "",
    "CliUser Id": "",
    "CliUser Password": ""
}`
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
        'integrations/app/apps/cli/src/assets/i18n/getText/ru.po'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 8)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "CliUser {{Username}}"
msgstr ""

msgid "CliUser Id"
msgstr ""

msgid "CliUser Password"
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
        'integrations/app/apps/cli/src/assets/i18n/getText/template.pot'
      )
    )
      .toString()
      .split('\n')
      .filter((v, i) => i > 7)
      .join('\n');
    expect(content.split(' ').join('').split('\n').join('')).toEqual(
      `msgid "CliUser {{Username}}"
msgstr "CliUser {{Username}}"

msgid "CliUser Id"
msgstr "CliUser Id"

msgid "CliUser Password"
msgstr "CliUser Password"`
        .split(' ')
        .join('')
        .split('\n')
        .join('')
    );
  });
});
