import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

describe('Copy paste env-replacer (e2e)', () => {
  it('new-1-user-repository.ts', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server-env-replacer/src/lib/new-1-user-repository.ts'
      )
    ).toString();
    expect(content).toEqual(`import { New1User } from './new-1-user';

export class New1UserRepository {
  version1 = '42';
  version2 = '\${APP_VERSION}';
  new1Users: New1User[];
  createOneNew1User() {
    //null
  }
  updateOneNew1User() {
    //null
  }
  deleteOneNew1User() {
    //null
  }
  findManyNew1Users() {
    //null
  }
}
`);
  });

  it('new-2-user-repository.ts', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server-env-replacer/src/lib/new-2-user-repository.ts'
      )
    ).toString();
    expect(content).toEqual(`import { New2User } from './new-2-user';

export class New2UserRepository {
  version1 = '%APP_VERSION%';
  version2 = '42';
  new2Users: New2User[];
  createOneNew2User() {
    //null
  }
  updateOneNew2User() {
    //null
  }
  deleteOneNew2User() {
    //null
  }
  findManyNew2Users() {
    //null
  }
}
`);
  });
});
