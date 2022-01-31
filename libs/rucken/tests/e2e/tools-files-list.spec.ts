import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Tools make-ts-list (e2e)', () => {
  it('libs/feature-client', () => {
    const makeTsList = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/client/src/index.ts'
      )
    )
      .toString()
      .split('\n');
    expect(makeTsList[0]).toEqual(`export * from './lib/feature-client-user';`);
    expect(makeTsList[1]).toEqual(
      `export * from './lib/feature-client.module';`
    );
  });

  it('libs/feature-server', () => {
    const makeTsList = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/index.ts'
      )
    )
      .toString()
      .split('\n');
    expect(makeTsList[0]).toEqual(`export * from './lib/feature-server-user';`);
    expect(makeTsList[1]).toEqual(
      `export * from './lib/feature-server.module';`
    );
  });

  it('libs/feature-common', () => {
    const makeTsList = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/common/src/index.ts'
      )
    )
      .toString()
      .split('\n');
    expect(makeTsList[0]).toEqual(`export * from './lib/feature-common-user';`);
    expect(makeTsList[1]).toEqual(`export * from './lib/feature-common';`);
  });

  //

  it('apps/client', () => {
    try {
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/apps/client/src/index.ts'
        )
      )
        .toString()
        .split('\n');
      expect(true).toEqual(false);
    } catch (error) {
      expect(true).toEqual(true);
    }
  });

  it('apps/server', () => {
    try {
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/apps/server/src/index.ts'
        )
      )
        .toString()
        .split('\n');
      expect(true).toEqual(false);
    } catch (error) {
      expect(true).toEqual(true);
    }
  });

  it('apps/cli', () => {
    try {
      readFileSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/apps/cli/src/index.ts'
        )
      )
        .toString()
        .split('\n');
      expect(true).toEqual(false);
    } catch (error) {
      expect(true).toEqual(true);
    }
  });
});
