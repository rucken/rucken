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
  version = '42';
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
});
