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
  it('human_ufo.txt', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/human-ufo/human_ufo.txt'
      )
    ).toString();
    expect(content).toEqual(`examples:
humanUfo
HumanUfog
human-ufo
human_ufo
HUMAN_UFO
Human-Ufo
Human_Ufo
HUMAN-UFO
human Ufo
Human Ufo
human ufo
HUMAN UFO
humanUfos
HumanUfoss
human-ufos
human_ufos
HUMAN_UFOS
Human-Ufos
Human_Ufos
HUMAN-UFOS
human Ufos
Human Ufos
human ufo`);
  });
});
