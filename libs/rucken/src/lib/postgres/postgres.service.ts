import { Injectable } from '@nestjs/common';
import { ConnectionString } from 'connection-string';
import { getLogger, Logger } from 'log4js';
import { Client } from 'pg';
import pgp from 'pg-promise';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class PostgresService {
  public static title = 'postgres';

  private logger: Logger;

  constructor(private readonly utilsService: UtilsService) {}

  setLogger(command: string): void {
    this.logger = getLogger(command);
    this.logger.level = UtilsService.logLevel();
  }

  async postgres({
    rootDatabaseUrl,
    appDatabaseUrl,
    dropAppDatabase,
    extensions,
  }: {
    rootDatabaseUrl: string;
    appDatabaseUrl: string;
    dropAppDatabase?: boolean;
    extensions: string[];
  }) {
    const envRootDatabaseUrl =
      process.env.ROOT_POSTGRES_URL || process.env.ROOT_DATABASE_URL;
    const envAppDatabaseUrl =
      process.env.POSTGRES_URL || process.env.DATABASE_URL;
    const envNxAppDatabaseUrls = Object.keys(
      this.utilsService.getWorkspaceProjects()
    )
      .map(
        (key) =>
          process.env[
            `${this.utilsService
              .getExtractAppName(key)
              .toUpperCase()}_POSTGRES_URL`
          ] ||
          process.env[
            `${this.utilsService
              .getExtractAppName(key)
              .toUpperCase()}_DATABASE_URL`
          ]
      )
      .filter(Boolean);

    if (!rootDatabaseUrl) {
      if (envRootDatabaseUrl) {
        rootDatabaseUrl = envRootDatabaseUrl;
      } else {
        this.logger.error(`rootDatabaseUrl not set`);
        return;
      }
    }
    if (!appDatabaseUrl) {
      if (envAppDatabaseUrl) {
        appDatabaseUrl = envAppDatabaseUrl;
      } else {
        if (envNxAppDatabaseUrls.length === 0) {
          this.logger.error(`appDatabaseUrl not set`);
          return;
        }
      }
    }
    if (appDatabaseUrl) {
      if (dropAppDatabase) {
        await this.dropAppDatabaseHandler(
          this.utilsService.replaceEnv(rootDatabaseUrl),
          this.utilsService.replaceEnv(appDatabaseUrl)
        );
      }
      await this.createAppDatabaseHandler(
        this.utilsService.replaceEnv(rootDatabaseUrl),
        this.utilsService.replaceEnv(appDatabaseUrl),
        extensions
      );
    } else {
      if (envNxAppDatabaseUrls.length > 0) {
        envNxAppDatabaseUrls.forEach(async (envNxAppDatabaseUrl) => {
          if (dropAppDatabase) {
            await this.dropAppDatabaseHandler(
              this.utilsService.replaceEnv(rootDatabaseUrl),
              this.utilsService.replaceEnv(envNxAppDatabaseUrl)
            );
          }
          await this.createAppDatabaseHandler(
            this.utilsService.replaceEnv(rootDatabaseUrl),
            this.utilsService.replaceEnv(envNxAppDatabaseUrl),
            extensions
          );
          await this.applyPermissionsHandler(
            this.utilsService.replaceEnv(rootDatabaseUrl),
            this.utilsService.replaceEnv(envNxAppDatabaseUrl)
          );
        });
      }
    }
  }

  async dropAppDatabaseHandler(
    rootDatabaseUrl: string,
    appDatabaseUrl: string
  ): Promise<void> {
    this.logger.info('Start drop database...');
    const rootDatabase = this.parseDatabaseUrl(rootDatabaseUrl);
    const appDatabase = this.parseDatabaseUrl(appDatabaseUrl);
    this.logger.debug('Root database:', rootDatabase.DATABASE);
    this.logger.debug('App database:', appDatabase.DATABASE);
    const db = pgp({})({
      user: rootDatabase.USERNAME,
      password: rootDatabase.PASSWORD,
      port: rootDatabase.PORT,
      host: (rootDatabase.HOST || '').split(':')[0],
    });
    if (appDatabase.USERNAME !== rootDatabase.USERNAME) {
      try {
        this.logger.debug(`DROP DATABASE "${appDatabase.DATABASE}"`);
        await db.none(`DROP DATABASE "${appDatabase.DATABASE}"`, []);
      } catch (err) {
        if (!String(err).includes('already exists')) {
          this.logger.error(err, err.stack);
          throw err;
        }
      }
    } else {
      this.logger.error(
        `Application database user and root database user must be different`
      );
    }
    db.$pool.end();
    this.logger.info('End of drop database...');
  }

  async createAppDatabaseHandler(
    rootDatabaseUrl: string,
    appDatabaseUrl: string,
    extensions: string[]
  ): Promise<void> {
    this.logger.info('Start create database...');
    const rootDatabase = this.parseDatabaseUrl(rootDatabaseUrl);
    const appDatabase = this.parseDatabaseUrl(appDatabaseUrl);
    this.logger.debug('Root database:', rootDatabase.DATABASE);
    this.logger.debug('App database:', appDatabase.DATABASE);
    const db = pgp({})({
      user: rootDatabase.USERNAME,
      password: rootDatabase.PASSWORD,
      port: rootDatabase.PORT,
      host: (rootDatabase.HOST || '').split(':')[0],
    });
    try {
      if (appDatabase.USERNAME !== rootDatabase.USERNAME) {
        try {
          this.logger.debug(`CREATE DATABASE ${appDatabase.DATABASE}`);
          await db.none('CREATE DATABASE $1:name', [appDatabase.DATABASE]);
        } catch (err) {
          if (!String(err).includes('already exists')) {
            this.logger.error(err, err.stack);
            throw err;
          }
        }

        await this.applyPermissionsHandler(rootDatabaseUrl, appDatabaseUrl);

        const updateDatabaseQuery = extensions
          .map((extension) => `CREATE EXTENSION IF NOT EXISTS "${extension}"`)
          .filter(Boolean)
          .map(
            (sql) =>
              `${sql};` ||
              `DO $$ BEGIN
    ${sql};
    EXCEPTION
    WHEN others THEN null;
    END $$;`
          );
        const pgAppConfig = {
          user: appDatabase.USERNAME,
          host: (rootDatabase.HOST || '').split(':')[0],
          password: appDatabase.PASSWORD,
          port: rootDatabase.PORT,
          database: appDatabase.DATABASE,
          idleTimeoutMillis: 30000,
        };
        const appClient = new Client(pgAppConfig);
        await appClient.connect();
        for (const query of updateDatabaseQuery) {
          try {
            this.logger.debug(query);
            await appClient.query(query);
          } catch (err) {
            if (!String(err).includes('already exists')) {
              this.logger.debug(query);
              this.logger.error(err, err.stack);
              throw err;
            }
          }
        }
        await appClient.end();
      } else {
        this.logger.error(
          `Application database user and root database user must be different`
        );
      }
    } catch (err) {
      if (!String(err).includes('already exists')) {
        this.logger.error(err, err.stack);
        throw err;
      }
    }
    db.$pool.end();

    this.logger.info('End of create database...');
  }

  async applyPermissionsHandler(
    rootDatabaseUrl: string,
    appDatabaseUrl: string
  ): Promise<void> {
    this.logger.info('Start apply permissions...');
    this.logger.debug('Root database url:', rootDatabaseUrl);
    this.logger.debug('App database url:', appDatabaseUrl);
    const rootDatabase = this.parseDatabaseUrl(rootDatabaseUrl);
    const appDatabase = this.parseDatabaseUrl(appDatabaseUrl);

    const createDatabaseQuery = [
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `CREATE USER "${appDatabase.USERNAME}" WITH PASSWORD '${appDatabase.PASSWORD}'`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `grant connect on database "${appDatabase.DATABASE}" to "${appDatabase.USERNAME}"`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `grant all on schema public to "${appDatabase.USERNAME}"`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${appDatabase.USERNAME}"`,
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${appDatabase.USERNAME}"`,
      `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${appDatabase.USERNAME}"`,
      `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "${appDatabase.USERNAME}"`,

      `GRANT delete, insert, references, select, trigger, truncate, update ON ALL TABLES IN SCHEMA public TO "${appDatabase.USERNAME}"`,
      `GRANT select, update, usage ON ALL SEQUENCES IN SCHEMA public TO "${appDatabase.USERNAME}"`,
      `GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO "${appDatabase.USERNAME}"`,

      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${appDatabase.USERNAME}"`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${appDatabase.USERNAME}"`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "${appDatabase.USERNAME}"`,

      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT delete, insert, references, select, trigger, truncate, update ON TABLES TO "${appDatabase.USERNAME}"`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT select, update, usage ON SEQUENCES TO "${appDatabase.USERNAME}"`,
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO "${appDatabase.USERNAME}"`,

      `GRANT ALL PRIVILEGES ON DATABASE "${appDatabase.DATABASE}" TO "${appDatabase.USERNAME}"`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `GRANT ALL PRIVILEGES ON DATABASE "${appDatabase.DATABASE}" TO ${rootDatabase.USERNAME}`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `ALTER USER "${appDatabase.USERNAME}" WITH LOGIN CREATEROLE NOCREATEDB NOSUPERUSER INHERIT`,
      appDatabase.USERNAME !== rootDatabase.USERNAME &&
        `DO $$ BEGIN
DECLARE
    t record;
BEGIN
    FOR t IN
        (select 'GRANT ALL ON TABLE ' || schemaname || '."' || tablename || '" to "${appDatabase.USERNAME}"' query
            from pg_tables
            where schemaname in ('public')
            order by schemaname, tablename)
        LOOP
            EXECUTE format('%s', t.query);
        END LOOP;
END;
END $$`,
    ]
      .filter(Boolean)
      .map(
        (sql: string) => `${sql};` /* ||
                `DO $$ BEGIN
${sql};
EXCEPTION
WHEN others THEN null;
END $$;`*/
      );
    const pgConfig = {
      user: rootDatabase.USERNAME,
      host: (rootDatabase.HOST || '').split(':')[0],
      password: rootDatabase.PASSWORD,
      port: rootDatabase.PORT,
      database: appDatabase.DATABASE,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    for (const query of createDatabaseQuery) {
      try {
        this.logger.debug(query);
        await client.query(query);
      } catch (err) {
        if (!String(err).includes('already exists')) {
          this.logger.debug(query);
          this.logger.error(err, err.stack);
          throw err;
        }
      }
    }
    await client.end();

    this.logger.info('End of apply permissions...');
  }

  parseDatabaseUrl(databaseUrl: string): {
    USERNAME?: string;
    PASSWORD?: string;
    HOST?: string;
    DATABASE?: string;
    SCHEMA: string;
    SCHEMAS: string;
    PORT?: number;
  } {
    const cs = new ConnectionString(databaseUrl);
    const USERNAME = cs.user;
    const PASSWORD = cs.password;
    const PORT = cs.port;
    const HOST = cs.hosts && cs.hosts[0].toString();
    const DATABASE = cs.path && cs.path[0];
    const SCHEMA = cs.params && cs.params.schema;
    const SCHEMAS = cs.params && cs.params.schemas;
    return { USERNAME, PASSWORD, HOST, DATABASE, SCHEMA, SCHEMAS, PORT };
  }
}
