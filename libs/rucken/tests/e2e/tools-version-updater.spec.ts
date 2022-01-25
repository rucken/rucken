import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Tools version-updater (e2e)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rootJson: any;

  beforeAll(() => {
    rootJson = JSON.parse(
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/package.json'
        )
      ).toString()
    );
  });

  it('libs/feature-client', () => {
    const json = JSON.parse(
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
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/client/package.json'
        )
      ).toString()
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
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/server/package.json'
        )
      ).toString()
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
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/apps/cli/package.json'
        )
      ).toString()
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
