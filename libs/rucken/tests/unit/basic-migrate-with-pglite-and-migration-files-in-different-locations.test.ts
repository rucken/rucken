import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'node:path';
import { HistoryTableService } from '../../src/lib/migrate/history-table.service';
import { MigrateCommands } from '../../src/lib/migrate/migrate.commands';
import { MigrateModule } from '../../src/lib/migrate/migrate.module';
import { MigrateService } from '../../src/lib/migrate/migrate.service';
import { Migration } from '../../src/lib/migrate/types/migration';
import {
  BASIC_MIGRATIONS,
  saveBasicMigrationsToFileSystem,
} from './basic-migrations';
import { getPostgres, Pg } from './utils/get-postgres';

describe('Basic migrate with pglite and migration files in different locations', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let migrateCommands: MigrateCommands;
  let migrateService: MigrateService;
  let historyTableService: HistoryTableService;
  let pg: Pg;

  beforeAll(async () => {
    // process.env['DEBUG'] = '*';

    await saveBasicMigrationsToFileSystem(
      join(
        __dirname,
        'basic-migrate-with-pglite-and-migration-files-in-different-locations'
      )
    );

    pg = await getPostgres();

    const bootstrap = await Test.createTestingModule({
      imports: [MigrateModule.forRoot()],
    }).compile();
    testingModule = await bootstrap.init();

    app = testingModule.createNestApplication();
    migrateCommands = testingModule.get(MigrateCommands);
    migrateService = testingModule.get(MigrateService);
    historyTableService = testingModule.get(HistoryTableService);
  });

  afterAll(async () => {
    await app.close();
    await pg.teardown();
  });

  it('Apply migrations', async () => {
    await migrateCommands.migrate({
      databaseUrl: pg.connectionString,
      locations: [
        join(
          __dirname,
          'basic-migrate-with-pglite-and-migration-files-in-different-locations/apps/server/src/migrations'
        ),
        join(
          __dirname,
          'basic-migrate-with-pglite-and-migration-files-in-different-locations/libs/server/src/migrations'
        ),
      ].join(','),
    });
  });

  it('Check data from seed migration in database', async () => {
    const appUserCategories = (
      await migrateService.execSqlForStatments({
        databaseUrl: pg.connectionString,
        migration: Migration.fromStatements({
          statements: ['select * from "AppUserCategory"'],
        }),
        placeholders: {},
      })
    ).flat();
    expect(appUserCategories).toMatchObject([
      {
        name: 'VIP',
        description: 'Users with VIP status',
      },
    ]);
  });

  it('Check comment on table from versioned migration in database', async () => {
    const comment = (
      await migrateService.execSqlForStatments({
        databaseUrl: pg.connectionString,
        migration: Migration.fromStatements({
          statements: [
            `SELECT t.table_name, pg_catalog.obj_description(pgc.oid, 'pg_class')
  FROM information_schema.tables t
           INNER JOIN pg_catalog.pg_class pgc
                      ON t.table_name = pgc.relname
  WHERE t.table_name = 'AppUser';`,
          ],
        }),
        placeholders: {},
      })
    ).flat();
    expect(comment).toMatchObject([
      {
        table_name: 'AppUser',
        obj_description: 'Application users',
      },
    ]);
  });

  it('Check migration history table', async () => {
    const migrations = (
      await migrateService.execSqlForStatments({
        databaseUrl: pg.connectionString,
        migration: Migration.fromStatements({
          statements: [await historyTableService.getMigrationsHistorySql()],
        }),
        placeholders: {},
      })
    ).flat();

    expect(migrations).toMatchObject([
      {
        installed_rank: 1,
        version: '202401010900',
        description: 'CreateUserTable',
        type: 'SQL',
        script: 'V202401010900__CreateUserTable.sql',
        checksum: -720020984,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.106Z',
        // execution_time: 14,
        success: true,
      },
      {
        installed_rank: 2,
        version: null,
        description: 'SetAllComments',
        type: 'SQL',
        script: 'objects/R__SetAllComments.sql',
        checksum: -900617502,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.126Z',
        // execution_time: 3,
        success: true,
      },
      {
        installed_rank: 3,
        version: null,
        description: 'DefaultCategories',
        type: 'SQL',
        script: 'seeds/R__DefaultCategories.sql',
        checksum: -1292430807,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.119Z',
        // execution_time: 6,
        success: true,
      },
    ]);
  });

  it('Update repeatable migration, run migrate and check migration history table, last migration is duplicate executed of R__DefaultCategories', async () => {
    BASIC_MIGRATIONS[
      'libs/server/src/migrations/seeds/R__DefaultCategories.sql'
    ] = `INSERT INTO "AppUserCategory" (name, description) VALUES ('VIP', 'Users with VIP status') ON CONFLICT (name) DO NOTHING;
--
INSERT INTO "AppUserCategory" (name, description) VALUES ('Beginner', 'Beginner users') ON CONFLICT (name) DO NOTHING;`;

    await saveBasicMigrationsToFileSystem(
      join(
        __dirname,
        'basic-migrate-with-pglite-and-migration-files-in-different-locations'
      )
    );

    await migrateCommands.migrate({
      databaseUrl: pg.connectionString,
      locations: [
        join(
          __dirname,
          'basic-migrate-with-pglite-and-migration-files-in-different-locations/apps/server/src/migrations'
        ),
        join(
          __dirname,
          'basic-migrate-with-pglite-and-migration-files-in-different-locations/libs/server/src/migrations'
        ),
      ].join(','),
    });

    const migrations = (
      await migrateService.execSqlForStatments({
        databaseUrl: pg.connectionString,
        migration: Migration.fromStatements({
          statements: [await historyTableService.getMigrationsHistorySql()],
        }),
        placeholders: {},
      })
    ).flat();

    expect(migrations).toMatchObject([
      {
        installed_rank: 1,
        version: '202401010900',
        description: 'CreateUserTable',
        type: 'SQL',
        script: 'V202401010900__CreateUserTable.sql',
        checksum: -720020984,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.106Z',
        // execution_time: 14,
        success: true,
      },
      {
        installed_rank: 2,
        version: null,
        description: 'SetAllComments',
        type: 'SQL',
        script: 'objects/R__SetAllComments.sql',
        checksum: -900617502,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.126Z',
        // execution_time: 3,
        success: true,
      },
      {
        installed_rank: 3,
        version: null,
        description: 'DefaultCategories',
        type: 'SQL',
        script: 'seeds/R__DefaultCategories.sql',
        checksum: -1292430807,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.119Z',
        // execution_time: 6,
        success: true,
      },
      {
        installed_rank: 4,
        version: null,
        description: 'DefaultCategories',
        type: 'SQL',
        script: 'seeds/R__DefaultCategories.sql',
        checksum: 1778283446,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.119Z',
        // execution_time: 6,
        success: true,
      },
    ]);
  });

  it('Update versioned migration, run migrate and catch error', async () => {
    BASIC_MIGRATIONS[
      'apps/server/src/migrations/V202401010900__CreateUserTable.sql'
    ] = `${BASIC_MIGRATIONS['apps/server/src/migrations/V202401010900__CreateUserTable.sql']};
--
CREATE INDEX "IDX_APP_USER__CATEGORY_ID" ON "AppUser"("categoryId");`;

    await saveBasicMigrationsToFileSystem(
      join(
        __dirname,
        'basic-migrate-with-pglite-and-migration-files-in-different-locations'
      )
    );

    try {
      await migrateCommands.migrate({
        databaseUrl: pg.connectionString,
        locations: [
          join(
            __dirname,
            'basic-migrate-with-pglite-and-migration-files-in-different-locations/apps/server/src/migrations'
          ),
          join(
            __dirname,
            'basic-migrate-with-pglite-and-migration-files-in-different-locations/libs/server/src/migrations'
          ),
        ].join(','),
      });
    } catch (err) {
      expect(err.message).toEqual(
        'Checksum for migration "V202401010900__CreateUserTable.sql" are different, in the history table: -720020984, in the file system: 1100360151'
      );
    }

    const migrations = (
      await migrateService.execSqlForStatments({
        databaseUrl: pg.connectionString,
        migration: Migration.fromStatements({
          statements: [await historyTableService.getMigrationsHistorySql()],
        }),
        placeholders: {},
      })
    ).flat();

    expect(migrations).toMatchObject([
      {
        installed_rank: 1,
        version: '202401010900',
        description: 'CreateUserTable',
        type: 'SQL',
        script: 'V202401010900__CreateUserTable.sql',
        checksum: -720020984,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.106Z',
        // execution_time: 14,
        success: true,
      },
      {
        installed_rank: 2,
        version: null,
        description: 'SetAllComments',
        type: 'SQL',
        script: 'objects/R__SetAllComments.sql',
        checksum: -900617502,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.126Z',
        // execution_time: 3,
        success: true,
      },
      {
        installed_rank: 3,
        version: null,
        description: 'DefaultCategories',
        type: 'SQL',
        script: 'seeds/R__DefaultCategories.sql',
        checksum: -1292430807,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.119Z',
        // execution_time: 6,
        success: true,
      },
      {
        installed_rank: 4,
        version: null,
        description: 'DefaultCategories',
        type: 'SQL',
        script: 'seeds/R__DefaultCategories.sql',
        checksum: 1778283446,
        installed_by: 'postgres',
        // installed_on: '2025-01-12T13:14:48.119Z',
        // execution_time: 6,
        success: true,
      },
    ]);
  });
});
