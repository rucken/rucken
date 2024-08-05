import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

describe('Copy paste glob (e2e)', () => {
  it('f1/README.md', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/copy-paste-glob-new/f1/README.md'
      )
    ).toString();
    expect(content).toEqual(`# README f1
`);
  });

  it('f2/README.md', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/copy-paste-glob-new/f2/README.md'
      )
    ).toString();
    expect(content).toEqual(`# README f2
`);
  });

  it('!f1/ignored-file.md', () => {
    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/copy-paste-glob-new/f1/ignored-file.md'
        )
      )
    ).toBeFalsy();
  });

  it('!f2/ignored-file.md', () => {
    expect(
      existsSync(
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'integrations/app/libs/copy-paste-glob-new/f2/ignored-file.md'
        )
      )
    ).toBeFalsy();
  });
});
