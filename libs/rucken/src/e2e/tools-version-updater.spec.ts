import { readFileSync } from 'fs';
import { resolve } from 'path';

const INTEGRATIONS_APP = resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'integrations',
  'app',
);

describe('Tools version-updater (e2e)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rootJson: any;

  beforeAll(() => {
    rootJson = JSON.parse(
      readFileSync(resolve(INTEGRATIONS_APP, 'package.json')).toString(),
    );
  });

  it('libs/feature-client', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'libs/feature/client/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/feature-client',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });

  it('libs/feature-server', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'libs/feature/server/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/feature-server',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });

  it('libs/feature-common', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'libs/feature/common/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/feature-common',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });

  it('apps/client', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'apps/client/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/client',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });

  it('apps/server', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'apps/server/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/server',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });

  it('apps/cli', () => {
    const json = JSON.parse(
      readFileSync(
        resolve(INTEGRATIONS_APP, 'apps/cli/package.json'),
      ).toString(),
    );
    expect(json).toMatchObject({
      name: '@app/cli',
      version: '0.0.0',
      dependencies: {
        rxjs: rootJson.dependencies.rxjs,
      },
    });
  });
});
