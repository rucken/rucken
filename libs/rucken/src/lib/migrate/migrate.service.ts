import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { getLogger, Logger } from 'log4js';
import recursive from 'recursive-readdir';
import { UtilsService } from '../utils/utils.service';

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { sort } from '../utils/cross-path-sort';
import { History, HistoryTableService } from './history-table.service';
import {
  CALLBACK_KEYS,
  MgrationFileMetadata,
  Migration,
} from './types/migration';
import { PoolClient } from './types/pool-client';

@Injectable()
export class MigrateService implements OnModuleDestroy {
  public static title = 'migrate';

  protected logger: Logger;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected Client: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected Pool: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected client: any;

  constructor(protected historyTableService: HistoryTableService) {}

  onModuleDestroy() {
    if (this.client) {
      this.client.release(true);
      this.client = null;
    }
  }

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  loadPackages() {
    if (!this.Client) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.Client = require('pg').Client;
    }
    if (!this.Pool) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.Pool = require('pg').Pool;
    }
  }

  async getClient({
    databaseUrl,
    dryRun,
  }: {
    databaseUrl?: string;
    dryRun: boolean;
  }) {
    if (!dryRun && !this.client) {
      const pool = new this.Pool({ connectionString: databaseUrl });
      this.client = await pool.connect();
    }
    return this.client;
  }

  async migrate({
    dryRun,
    databaseUrl,
    locations,
    historyTable,
    sqlMigrationSuffixes,
    sqlMigrationSeparator,
    sqlMigrationStatementSeparator,
  }: {
    dryRun?: boolean;
    databaseUrl: string;
    locations: string[];
    historyTable: string;
    sqlMigrationSuffixes: string[];
    sqlMigrationSeparator: string;
    sqlMigrationStatementSeparator: string;
  }) {
    if (dryRun) {
      this.logger.info(`Dry run: true`);
    }
    this.logger.info(`Locations: ${locations.join(',')}`);
    this.logger.info(`HistoryTable: ${historyTable}`);
    this.logger.info(`DatabaseUrl: ${databaseUrl}`);

    if (!dryRun) {
      this.loadPackages();
    }

    const migrations: Migration[] = await this.getMigrations(
      dryRun,
      locations,
      sqlMigrationSuffixes,
      sqlMigrationSeparator,
      sqlMigrationStatementSeparator
    );
    this.logger.info(
      `Migrations: ${
        migrations.filter((m) => m.versioned || m.repeatable || m.undo).length
      }`
    );

    await this.getClient({ databaseUrl, dryRun });

    await this.execSqlForStatments({
      migration: Migration.fromStatements({
        statements: [
          await this.historyTableService.getCreateHistoryTableSql({
            historyTable,
          }),
        ],
        sqlMigrationSeparator,
        sqlMigrationStatementSeparator,
      }),
      databaseUrl,
      dryRun,
      historyTable,
      placeholders: {},
    });

    const histories = (
      await this.execSqlForStatments<History>({
        migration: Migration.fromStatements({
          statements: [
            await this.historyTableService.getMigrationsHistorySql({
              historyTable,
            }),
          ],
          sqlMigrationSeparator,
          sqlMigrationStatementSeparator,
        }),
        databaseUrl,
        dryRun,
        historyTable,
        placeholders: {},
      })
    ).flat();

    let collection: {
      filedir: string;
      callback: {
        beforeMigrate?: Migration[];
        beforeRepeatables?: Migration[];
        beforeEachMigrate?: Migration[];
        beforeEachMigrateStatement?: Migration[];
        afterEachMigrateStatement?: Migration[];
        afterEachMigrateStatementError?: Migration[];
        afterEachMigrate?: Migration[];
        afterEachMigrateError?: Migration[];
        afterMigrate?: Migration[];
        afterMigrateApplied?: Migration[];
        afterVersioned?: Migration[];
        afterMigrateError?: Migration[];
      };
    } = {
      filedir: '',
      callback: {},
    };

    collection = await this.loopForVersionedMigrations({
      migrations,
      histories,
      collection,
      databaseUrl,
      dryRun,
      historyTable,
    });

    collection = await this.loopForRepeatableMigrations({
      migrations,
      histories,
      collection,
      databaseUrl,
      dryRun,
      historyTable,
    });
  }

  private async getMigrations(
    dryRun: boolean,
    locations: string[],
    sqlMigrationSuffixes: string[],
    sqlMigrationSeparator: string,
    sqlMigrationStatementSeparator: string
  ) {
    const files: MgrationFileMetadata[] = sort(
      await this.getFiles({ dryRun, locations, sqlMigrationSuffixes }),
      {
        deepFirst: true,
        segmentCompareFn: (a: Migration, b: Migration) =>
          a.filedir.localeCompare(b.filedir),
      }
    );

    const migrations: Migration[] = [];
    for (const file of files) {
      migrations.push(
        await new Migration(
          file.filepath,
          sqlMigrationSeparator,
          sqlMigrationStatementSeparator,
          file.sqlMigrationSuffix,
          file.location
        ).fill(await this.loadMigrationFile(file.filepath))
      );
    }
    return migrations;
  }

  private async loopForRepeatableMigrations({
    migrations,
    histories,
    collection,
    databaseUrl,
    dryRun,
    historyTable,
  }: {
    migrations: Migration[];
    histories: History[];
    collection: {
      filedir: string;
      callback: {
        beforeMigrate?: Migration[];
        beforeRepeatables?: Migration[];
        beforeEachMigrate?: Migration[];
        beforeEachMigrateStatement?: Migration[];
        afterEachMigrateStatement?: Migration[];
        afterEachMigrateStatementError?: Migration[];
        afterEachMigrate?: Migration[];
        afterEachMigrateError?: Migration[];
        afterMigrate?: Migration[];
        afterMigrateApplied?: Migration[];
        afterVersioned?: Migration[];
        afterMigrateError?: Migration[];
      };
    };
    databaseUrl: string;
    dryRun: boolean;
    historyTable: string;
  }) {
    try {
      for (const migration of migrations.filter(
        (m) =>
          m.repeatable &&
          !histories.find(
            (h) => h && h.script === m.script && h.checksum === m.filechecksum
          )
      )) {
        if (migration.filedir !== collection.filedir) {
          collection = {
            filedir: migration.filedir,
            callback: {},
          };
          for (const key of CALLBACK_KEYS) {
            collection.callback[key] = [];
          }
          for (const key of CALLBACK_KEYS) {
            collection.callback[key] = migrations.filter(
              (
                m //m.filedir === migration.filedir &&
              ) => m.callback?.[key]
            );
          }
        }
        // beforeMigrate
        for (const beforeMigrate of collection.callback.beforeMigrate || []) {
          if (migration.filename) {
            await this.execSqlForStatments({
              migration: beforeMigrate,
              databaseUrl,
              dryRun,
              historyTable,
              placeholders: migration,
            });
          }
        }
        // beforeEachMigrate
        for (const beforeEachMigrate of collection.callback.beforeEachMigrate ||
          []) {
          if (migration.filename) {
            await this.execSqlForStatments({
              migration: beforeEachMigrate,
              databaseUrl,
              dryRun,
              historyTable,
              placeholders: migration,
            });
          }
        }
        try {
          // APPLY MIGRATION
          await this.execSqlForStatments({
            placeholders: {},
            migration: migration,
            databaseUrl,
            dryRun,
            historyTable,
            beforeEachStatment: async (client) => {
              // beforeEachMigrateStatement
              for (const beforeEachMigrateStatement of collection.callback
                .beforeEachMigrateStatement || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: beforeEachMigrateStatement,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
            afterEachStatment: async (client) => {
              // afterEachMigrateStatement
              for (const afterEachMigrateStatement of collection.callback
                .afterEachMigrateStatement || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: afterEachMigrateStatement,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
            errorEachStatment: async (client) => {
              // afterEachMigrateStatementError
              for (const afterEachMigrateStatementError of collection.callback
                .afterEachMigrateStatementError || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: afterEachMigrateStatementError,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
          });
        } catch (afterEachMigrateError) {
          this.logger.error(
            'afterEachMigrateError#error: ',
            afterEachMigrateError
          );
          this.logger.info('afterEachMigrateError#migration: ', migration);
          // afterEachMigrateError
          for (const afterEachMigrateError of collection.callback
            .afterEachMigrateError || []) {
            if (migration.filename) {
              await this.execSqlForStatments({
                migration: afterEachMigrateError,
                databaseUrl,
                dryRun,
                historyTable,
                placeholders: migration,
              });
            }
          }
          throw afterEachMigrateError;
        } finally {
          // afterEachMigrate
          for (const afterEachMigrate of collection.callback.afterEachMigrate ||
            []) {
            if (migration.filename) {
              await this.execSqlForStatments({
                migration: afterEachMigrate,
                databaseUrl,
                dryRun,
                historyTable,
                placeholders: migration,
              });
            }
          }
        }
      }
    } catch (afterMigrateError) {
      this.logger.error('afterMigrateError#error: ', afterMigrateError);
      // afterVersioned
      for (const afterMigrateError of collection.callback.afterMigrateError ||
        []) {
        await this.execSqlForStatments({
          migration: afterMigrateError,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
      throw afterMigrateError;
    } finally {
      // afterMigrate
      for (const afterMigrate of collection.callback.afterMigrate || []) {
        await this.execSqlForStatments({
          migration: afterMigrate,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
      // afterMigrateApplied
      for (const afterMigrateApplied of collection.callback
        .afterMigrateApplied || []) {
        await this.execSqlForStatments({
          migration: afterMigrateApplied,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
    }
    return collection;
  }

  private async loopForVersionedMigrations({
    migrations,
    histories,
    collection,
    databaseUrl,
    dryRun,
    historyTable,
  }: {
    migrations: Migration[];
    histories: History[];
    collection: {
      filedir: string;
      callback: {
        beforeMigrate?: Migration[];
        beforeRepeatables?: Migration[];
        beforeEachMigrate?: Migration[];
        beforeEachMigrateStatement?: Migration[];
        afterEachMigrateStatement?: Migration[];
        afterEachMigrateStatementError?: Migration[];
        afterEachMigrate?: Migration[];
        afterEachMigrateError?: Migration[];
        afterMigrate?: Migration[];
        afterMigrateApplied?: Migration[];
        afterVersioned?: Migration[];
        afterMigrateError?: Migration[];
      };
    };
    databaseUrl: string;
    dryRun: boolean;
    historyTable: string;
  }) {
    try {
      for (const migration of migrations.filter(
        (m) =>
          m.versioned &&
          !histories.find(
            (h) =>
              h &&
              h.script === m.script &&
              h.checksum === m.filechecksum &&
              h.success
          )
      )) {
        const history = histories.find(
          (h) => h && h.script === migration.script && h.success
        );
        if (history && history.checksum !== migration.filechecksum) {
          throw new Error(
            `Checksum for migration "${history.script}" are different, in the history table: ${history.checksum}, in the file system: ${migration.filechecksum}`
          );
        }
        if (migration.filedir !== collection.filedir) {
          collection = {
            filedir: migration.filedir,
            callback: {},
          };
          for (const key of CALLBACK_KEYS) {
            collection.callback[key] = [];
          }
          for (const key of CALLBACK_KEYS) {
            collection.callback[key] = migrations.filter(
              (
                m // m.filedir === migration.filedir &&
              ) => m.callback?.[key]
            );
          }
        }
        // beforeMigrate
        for (const beforeMigrate of collection.callback.beforeMigrate || []) {
          if (migration.filename) {
            await this.execSqlForStatments({
              migration: beforeMigrate,
              databaseUrl,
              dryRun,
              historyTable,
              placeholders: migration,
            });
          }
        }
        // beforeEachMigrate
        for (const beforeEachMigrate of collection.callback.beforeEachMigrate ||
          []) {
          if (migration.filename) {
            await this.execSqlForStatments({
              migration: beforeEachMigrate,
              databaseUrl,
              dryRun,
              historyTable,
              placeholders: migration,
            });
          }
        }
        try {
          // APPLY MIGRATION
          await this.execSqlForStatments({
            placeholders: {},
            migration: migration,
            databaseUrl,
            dryRun,
            historyTable,
            beforeEachStatment: async (client) => {
              // beforeEachMigrateStatement
              for (const beforeEachMigrateStatement of collection.callback
                .beforeEachMigrateStatement || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: beforeEachMigrateStatement,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
            afterEachStatment: async (client) => {
              // afterEachMigrateStatement
              for (const afterEachMigrateStatement of collection.callback
                .afterEachMigrateStatement || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: afterEachMigrateStatement,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
            errorEachStatment: async (client) => {
              // afterEachMigrateStatementError
              for (const afterEachMigrateStatementError of collection.callback
                .afterEachMigrateStatementError || []) {
                if (migration.filename) {
                  await this.execSqlForStatments({
                    migration: afterEachMigrateStatementError,
                    databaseUrl,
                    client,
                    dryRun,
                    historyTable,
                    placeholders: migration,
                  });
                }
              }
            },
          });
        } catch (afterEachMigrateError) {
          this.logger.error(
            'afterEachMigrateError#error: ',
            afterEachMigrateError
          );
          this.logger.info('afterEachMigrateError#migration: ', migration);
          // afterEachMigrateError
          for (const afterEachMigrateError of collection.callback
            .afterEachMigrateError || []) {
            if (migration.filename) {
              await this.execSqlForStatments({
                migration: afterEachMigrateError,
                databaseUrl,
                dryRun,
                historyTable,
                placeholders: migration,
              });
            }
          }
          throw afterEachMigrateError;
        } finally {
          // afterEachMigrate
          for (const afterEachMigrate of collection.callback.afterEachMigrate ||
            []) {
            if (migration.filename) {
              await this.execSqlForStatments({
                migration: afterEachMigrate,
                databaseUrl,
                dryRun,
                historyTable,
                placeholders: migration,
              });
            }
          }
        }
      }
      // afterMigrate
      for (const afterMigrate of collection.callback.afterMigrate || []) {
        await this.execSqlForStatments({
          migration: afterMigrate,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
    } catch (afterMigrateError) {
      this.logger.error('afterMigrateError#error: ', afterMigrateError);
      // afterVersioned
      for (const afterMigrateError of collection.callback.afterMigrateError ||
        []) {
        await this.execSqlForStatments({
          migration: afterMigrateError,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
      throw afterMigrateError;
    } finally {
      // afterMigrateApplied
      for (const afterMigrateApplied of collection.callback
        .afterMigrateApplied || []) {
        await this.execSqlForStatments({
          migration: afterMigrateApplied,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
      // afterVersioned
      for (const afterVersioned of collection.callback.afterVersioned || []) {
        await this.execSqlForStatments({
          migration: afterVersioned,
          databaseUrl,
          dryRun,
          historyTable,
          placeholders: {},
        });
      }
    }
    return collection;
  }

  async loadMigrationFile(filepath: string): Promise<string> {
    return (await readFile(filepath)).toString();
  }

  async execSql({
    client,
    query,
    dryRun,
    migration,
    databaseUrl,
    placeholders,
  }: {
    client?: PoolClient;
    query: string;
    dryRun: boolean;
    migration?: Migration;
    databaseUrl: string;
    placeholders: Record<string, string>;
  }) {
    let newQuery = query;

    for (const [key, value] of Object.entries(placeholders)) {
      newQuery = newQuery.replace(new RegExp(`%${key}%`, 'g'), value);
    }
    if (dryRun) {
      this.logger.info('execSql (dryRun):', newQuery);
    } else {
      const result = await client.query(newQuery);
      return result.rows;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execSqlForStatments<T = any>({
    migration,
    databaseUrl,
    beforeEachStatment,
    afterEachStatment,
    errorEachStatment,
    client,
    dryRun,
    historyTable,
    placeholders,
  }: {
    migration: Migration;
    databaseUrl: string;
    beforeEachStatment?: (client: PoolClient) => Promise<void>;
    afterEachStatment?: (client: PoolClient) => Promise<void>;
    errorEachStatment?: (client: PoolClient) => Promise<void>;
    client?: PoolClient;
    dryRun?: boolean;
    historyTable?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placeholders: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<T[]> {
    client = await this.getClient({ databaseUrl, dryRun });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = [];

    let nextInstalledRank = 0;
    const startExecutionTime = new Date();
    if (
      migration.filepath &&
      Object.keys(migration.callback || {}).length === 0
    ) {
      const result = (
        await this.execSqlForStatments({
          migration: Migration.fromStatements({
            statements: [
              await this.historyTableService.getNextInstalledRankSql({
                migration,
                historyTable,
              }),
            ],
          }),
          databaseUrl,
          dryRun,
          historyTable,
          client,
          placeholders: migration,
        })
      ).flat();
      nextInstalledRank = result[0]?.installed_rank || 1;
    }
    try {
      if (
        migration.filepath &&
        Object.keys(migration.callback || {}).length === 0
      ) {
        await this.execSqlForStatments({
          migration: Migration.fromStatements({
            statements: [
              await this.historyTableService.getBeforeRunMigrationSql({
                migration,
                historyTable,
                installed_rank: nextInstalledRank,
              }),
            ],
          }),
          databaseUrl,
          dryRun,
          historyTable,
          client,
          placeholders: migration,
        });
      }
      await this.execSql({
        databaseUrl,
        migration,
        query: 'BEGIN',
        dryRun,
        client,
        placeholders,
      });
      for (const query of migration.statements) {
        if (beforeEachStatment) {
          await beforeEachStatment(client);
        }
        try {
          result.push(
            await this.execSql({
              databaseUrl,
              migration,
              client,
              query,
              dryRun,
              placeholders,
            })
          );
        } catch (errorEachStatmentError) {
          this.logger.error(
            'errorEachStatment#error: ',
            errorEachStatmentError
          );
          this.logger.info('errorEachStatment#query: ', query);
          this.logger.info('errorEachStatment#file: ', migration.filepath);
          if (migration.filepath) {
            this.logger.info('filepath: ', migration.filepath);
          }
          if (errorEachStatment) {
            await errorEachStatment(client);
          }
          throw errorEachStatmentError;
        } finally {
          if (afterEachStatment) {
            await afterEachStatment(client);
          }
        }
      }
      await this.execSql({
        databaseUrl,
        migration,
        query: 'COMMIT',
        dryRun,
        client,
        placeholders,
      });
    } catch (err) {
      if (!dryRun) {
        await this.execSql({
          databaseUrl,
          migration,
          query: 'ROLLBACK',
          dryRun,
          client,
          placeholders,
        });
      }
      if (
        migration.filepath &&
        Object.keys(migration.callback || {}).length === 0
      ) {
        await this.execSqlForStatments({
          migration: Migration.fromStatements({
            statements: [
              await this.historyTableService.getAfterRunMigrationSql({
                historyTable,
                installed_rank: nextInstalledRank,
                execution_time: +new Date() - +startExecutionTime,
                success: false,
              }),
            ],
          }),
          databaseUrl,
          dryRun,
          historyTable,
          client,
          placeholders: migration,
        });
      }
      throw err;
    } finally {
      if (
        migration.filepath &&
        Object.keys(migration.callback || {}).length === 0
      ) {
        await this.execSqlForStatments({
          migration: Migration.fromStatements({
            statements: [
              await this.historyTableService.getAfterRunMigrationSql({
                historyTable,
                installed_rank: nextInstalledRank,
                execution_time: +new Date() - +startExecutionTime,
                success: true,
              }),
            ],
          }),
          databaseUrl,
          dryRun,
          historyTable,
          client,
          placeholders: migration,
        });
      }
    }
    return result;
  }

  async getFiles({
    dryRun,
    locations,
    sqlMigrationSuffixes,
  }: {
    dryRun?: boolean;
    locations: string[];
    sqlMigrationSuffixes: string[];
  }): Promise<MgrationFileMetadata[]> {
    let files: MgrationFileMetadata[] = [];
    for (const location of locations) {
      for (const sqlMigrationSuffix of sqlMigrationSuffixes) {
        files = !existsSync(location)
          ? files
          : [
              ...files,
              ...(await recursive(location, [`!*${sqlMigrationSuffix}`])).map(
                (filepath) => ({ filepath, location, sqlMigrationSuffix })
              ),
            ];
      }
    }
    return files;
  }
}
