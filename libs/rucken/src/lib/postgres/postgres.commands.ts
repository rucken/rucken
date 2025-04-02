import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_POSTGRES_CONFIG } from './postgres.config';

@Console()
export class PostgresCommands {
  private readonly postgresConfig = this.utilsService.getRuckenConfig(
    DEFAULT_POSTGRES_CONFIG
  ).postgres;

  constructor(private readonly utilsService: UtilsService) {}

  @Command({
    command: 'postgres',
    description: 'postgres application database creator',
    options: [
      {
        flags: '-r,--root-database-url [strings]',
        description:
          'database url for connect as root user (example: postgres://ROOT_POSTGRES_USER:ROOT_POSTGRES_PASSWORD@localhost:POSTGRES_PORT/postgres?schema=public)',
      },
      {
        flags: '-a,--app-database-url [strings]',
        description:
          'application database url used for create new database (example: postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DATABASE?schema=public)',
      },
      {
        flags: '-fu,--force-change-username [boolean]',
        description:
          'force rename username if one exists in database for app-database-url excluding root (default: false)',
      },
      {
        flags: '-fp,--force-change-password [boolean]',
        description:
          'force change password of specified app-database-url (default: false)',
      },
      {
        flags: '-d,--drop-app-database [boolean]',
        description:
          'drop application database before try create it (default: false)',
      },
    ],
  })
  async postgres({
    rootDatabaseUrl,
    appDatabaseUrl,
    forceChangeUsername,
    forceChangePassword,
    dropAppDatabase,
  }: {
    rootDatabaseUrl: string;
    appDatabaseUrl: string;
    forceChangeUsername?: boolean;
    forceChangePassword?: boolean;
    dropAppDatabase?: boolean;
  }) {
    throw new Error(
      'The postgres application database creator has been moved to the project https://github.com/EndyKaufman/pg-tools and is published as a console utility https://www.npmjs.com/package/pg-create-db'
    );
  }
}
