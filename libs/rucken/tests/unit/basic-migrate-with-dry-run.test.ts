import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MigrateCommands } from '../../src/lib/migrate/migrate.commands';
import { MigrateModule } from '../../src/lib/migrate/migrate.module';
import { MigrateService } from '../../src/lib/migrate/migrate.service';
import {
  MgrationFileMetadata,
  Migration,
} from '../../src/lib/migrate/types/migration';
import { PoolClient } from '../../src/lib/migrate/types/pool-client';
import { BASIC_MIGRATIONS } from './basic-migrations';

describe('Basic migrate with dryRun', () => {
  const executedSqlQueries: string[] = [];

  let app: INestApplication;
  let testingModule: TestingModule;
  let migrateCommands: MigrateCommands;

  class CustomMigrateService extends MigrateService {
    async getFiles({
      dryRun,
      locations,
      sqlMigrationSuffixes,
    }: {
      dryRun?: boolean;
      locations: string[];
      sqlMigrationSuffixes: string[];
    }): Promise<MgrationFileMetadata[]> {
      return Object.keys(BASIC_MIGRATIONS).map((filepath) => ({
        filepath,
        location: 'libs/core/auth/src',
        sqlMigrationSuffix: '.sql',
      }));
    }

    async loadMigrationFile(filepath: string): Promise<string> {
      return BASIC_MIGRATIONS[filepath];
    }

    async execSql({
      client,
      query,
      dryRun,
      migration,
    }: {
      client?: PoolClient;
      query: string;
      dryRun: boolean;
      migration?: Migration;
    }): Promise<void> {
      if (migration.filepath) {
        executedSqlQueries.push(query);
      }
    }
  }

  beforeAll(async () => {
    // process.env['DEBUG'] = '*';

    const bootstrap = await Test.createTestingModule({
      imports: [MigrateModule.forRoot()],
    })
      .overrideProvider(MigrateService)
      .useClass(CustomMigrateService)
      .compile();
    testingModule = await bootstrap.init();

    app = testingModule.createNestApplication();
    migrateCommands = testingModule.get(MigrateCommands);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Apply migrations and check executed sql scripts', async () => {
    await migrateCommands.migrate({
      dryRun: true,
      databaseUrl: '',
    });
    expect(executedSqlQueries).toMatchObject(
      [
        BASIC_MIGRATIONS[
          'apps/server/src/migrations/V202401010900__CreateUserTable.sql'
        ],
        BASIC_MIGRATIONS[
          'apps/server/src/migrations/objects/R__SetAllComments.sql'
        ],
        BASIC_MIGRATIONS[
          'libs/server/src/migrations/seeds/R__DefaultCategories.sql'
        ],
      ].reduce(
        (all: string[], cur: string) => [...all, 'BEGIN', cur, 'COMMIT'],
        []
      )
    );
  });
});
