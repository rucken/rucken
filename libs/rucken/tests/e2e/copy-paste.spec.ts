import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Copy paste (e2e)', () => {
  it('libs/my-company', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/lib/my-company.ts'
      )
    ).toString();
    expect(content).toEqual(`export class MyCompany {
  id: string;
}
`);
  });

  it('libs/my-company-repository', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/lib/my-company-repository.ts'
      )
    ).toString();
    expect(content).toEqual(`import { MyCompany } from './my-company';

export class MyCompanyRepository {
  myCompanies: MyCompany[];
  createOneMyCompany() {
    //null
  }
  updateOneMyCompany() {
    //null
  }
  deleteOneMyCompany() {
    //null
  }
  findManyMyCompanies() {
    //null
  }
}
`);
  });

  it('libs/feature-server', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/feature/server/src/lib/feature-server-company.ts'
      )
    ).toString();
    expect(content)
      .toEqual(`import { getText } from 'class-validator-multi-lang';

export class FeatureServerCompanies {
  static strings = {
    id: getText('FeatureServerCompany Id'),
    username: getText('FeatureServerCompany "Username #1"'),
    password: getText("FeatureServerCompany 'Password'"),
  };
}
`);
  });

  it('apps/test-server', () => {
    const content = readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'integrations/app/libs/test/server/src/lib/feature-server-company.ts'
      )
    ).toString();
    expect(content)
      .toEqual(`import { getText } from 'class-validator-multi-lang';

export class FeatureServerCompanies {
  static strings = {
    id: getText('FeatureServerCompany Id'),
    username: getText('FeatureServerCompany "Username #1"'),
    password: getText("FeatureServerCompany 'Password'"),
  };
}
`);
  });
});
