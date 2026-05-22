import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
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

describe('Copy paste glob (e2e)', () => {
  it('f1/README.md', () => {
    const content = readFileSync(
      resolve(INTEGRATIONS_APP, 'libs/copy-paste-glob-new/f1/README.md'),
    ).toString();
    expect(content).toEqual(`# README f1
`);
  });

  it('f2/README.md', () => {
    const content = readFileSync(
      resolve(INTEGRATIONS_APP, 'libs/copy-paste-glob-new/f2/README.md'),
    ).toString();
    expect(content).toEqual(`# README f2
`);
  });

  it('!f1/ignored-file.md', () => {
    expect(
      existsSync(
        resolve(
          INTEGRATIONS_APP,
          'libs/copy-paste-glob-new/f1/ignored-file.md',
        ),
      ),
    ).toBeFalsy();
  });

  it('!f2/ignored-file.md', () => {
    expect(
      existsSync(
        resolve(
          INTEGRATIONS_APP,
          'libs/copy-paste-glob-new/f2/ignored-file.md',
        ),
      ),
    ).toBeFalsy();
  });
});
