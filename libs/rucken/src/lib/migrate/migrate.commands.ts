/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_MIGRATE_CONFIG } from './migrate.config';

@Console()
export class MigrateCommands {
  private readonly migrateConfig = this.utilsService.getRuckenConfig(
    DEFAULT_MIGRATE_CONFIG
  ).migrate;

  constructor(private readonly utilsService: UtilsService) {}

  @Command({
    command: 'migrate',
    description:
      'database migration tool, NodeJS version of Java migration tool - flyway, supported databases: PostrgeSQL',
    options: [
      {
        flags: '-dry,--dry-run [boolean]',
        description:
          'show content of migrations without apply them in database (default: false)',
      },
      {
        flags: '-db,--database-url [strings]',
        description:
          'database url for connect (example: postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DATABASE?schema=public)',
      },
      {
        flags: '-l,--locations [strings]',
        description: 'locations with migration files (default: migrations)',
      },
      {
        flags: '-t,--historyTable [strings]',
        description:
          'history table with states of migration (default: __migrations)',
      },
      {
        flags: '-f,--sql-migration-suffixes [strings]',
        description: 'extension of migration files (default: .sql)',
      },
    ],
  })
  async migrate({
    dryRun,
    databaseUrl,
    locations,
    historyTable,
    sqlMigrationSuffixes,
  }: {
    dryRun?: boolean;
    databaseUrl?: string;
    locations?: string;
    historyTable?: string;
    sqlMigrationSuffixes?: string;
  }) {
    throw new Error(
      'The migration command has been moved to the project https://github.com/EndyKaufman/pg-tools and is published as a console utility https://www.npmjs.com/package/pg-flyway'
    );
  }
}
