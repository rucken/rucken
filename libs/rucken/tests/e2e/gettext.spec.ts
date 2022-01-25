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
    expect(content).toEqual(`{
    "FeatureClientUser Id": "FeatureClientUser Id"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureClientUser Id"
msgstr "FeatureClientUser Id"`);

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
    expect(content).toEqual(`{
    "FeatureClientUser Id": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureClientUser Id"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureClientUser Id"
msgstr "FeatureClientUser Id"`);
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
    expect(content).toEqual(`{
    "FeatureServerUser Id": "FeatureServerUser Id",
    "FeatureServerUser Password": "FeatureServerUser Password",
    "FeatureServerUser Username": "FeatureServerUser Username"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureServerUser Id"
msgstr "FeatureServerUser Id"

msgid "FeatureServerUser Password"
msgstr "FeatureServerUser Password"

msgid "FeatureServerUser Username"
msgstr "FeatureServerUser Username"`);

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
    expect(content).toEqual(`{
    "FeatureServerUser Id": "",
    "FeatureServerUser Password": "",
    "FeatureServerUser Username": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureServerUser Id"
msgstr ""

msgid "FeatureServerUser Password"
msgstr ""

msgid "FeatureServerUser Username"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureServerUser Id"
msgstr "FeatureServerUser Id"

msgid "FeatureServerUser Password"
msgstr "FeatureServerUser Password"

msgid "FeatureServerUser Username"
msgstr "FeatureServerUser Username"`);
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
    expect(content).toEqual(`{
    "FeatureCommonUser Id": "FeatureCommonUser Id",
    "FeatureCommonUser Password": "FeatureCommonUser Password",
    "FeatureCommonUser Username": "FeatureCommonUser Username"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureCommonUser Id"
msgstr "FeatureCommonUser Id"

msgid "FeatureCommonUser Password"
msgstr "FeatureCommonUser Password"

msgid "FeatureCommonUser Username"
msgstr "FeatureCommonUser Username"`);

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
    expect(content).toEqual(`{
    "FeatureCommonUser Id": "",
    "FeatureCommonUser Password": "",
    "FeatureCommonUser Username": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureCommonUser Id"
msgstr ""

msgid "FeatureCommonUser Password"
msgstr ""

msgid "FeatureCommonUser Username"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "FeatureCommonUser Id"
msgstr "FeatureCommonUser Id"

msgid "FeatureCommonUser Password"
msgstr "FeatureCommonUser Password"

msgid "FeatureCommonUser Username"
msgstr "FeatureCommonUser Username"`);
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
    expect(content).toEqual(`{
    "Id": "Id"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "Id"
msgstr "Id"`);

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
    expect(content).toEqual(`{
    "Id": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "Id"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "Id"
msgstr "Id"`);
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
    expect(content).toEqual(`{
    "ServerUser Id": "ServerUser Id",
    "ServerUser Username": "ServerUser Username",
    "ServerUserPassword": "ServerUserPassword"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "ServerUser Id"
msgstr "ServerUser Id"

msgid "ServerUser Username"
msgstr "ServerUser Username"

msgid "ServerUserPassword"
msgstr "ServerUserPassword"`);

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
    expect(content).toEqual(`{
    "ServerUser Id": "",
    "ServerUser Username": "",
    "ServerUserPassword": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "ServerUser Id"
msgstr ""

msgid "ServerUser Username"
msgstr ""

msgid "ServerUserPassword"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "ServerUser Id"
msgstr "ServerUser Id"

msgid "ServerUser Username"
msgstr "ServerUser Username"

msgid "ServerUserPassword"
msgstr "ServerUserPassword"`);
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
    expect(content).toEqual(`{
    "CliUser Id": "CliUser Id",
    "CliUser Password": "CliUser Password",
    "CliUser Username": "CliUser Username"
}`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "CliUser Id"
msgstr "CliUser Id"

msgid "CliUser Password"
msgstr "CliUser Password"

msgid "CliUser Username"
msgstr "CliUser Username"`);

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
    expect(content).toEqual(`{
    "CliUser Id": "",
    "CliUser Password": "",
    "CliUser Username": ""
}`);

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
      .filter((v, i) => i > 10)
      .join('\n');
    expect(content).toEqual(`msgid "CliUser Id"
msgstr ""

msgid "CliUser Password"
msgstr ""

msgid "CliUser Username"
msgstr ""`);

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
      .filter((v, i) => i > 9)
      .join('\n');
    expect(content).toEqual(`msgid "CliUser Id"
msgstr "CliUser Id"

msgid "CliUser Password"
msgstr "CliUser Password"

msgid "CliUser Username"
msgstr "CliUser Username"`);
  });
});
