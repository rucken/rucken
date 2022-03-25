import execa from 'execa';
import { resolve } from 'path';
import { Client } from 'pg';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

describe('Postgres (e2e)', () => {
  jest.setTimeout(5 * 60 * 1000);
  let container: StartedTestContainer;
  const ROOT_POSTGRES_USER = 'postgres';
  const ROOT_POSTGRES_PASSWORD = 'ROOT_POSTGRES_PASSWORD';
  const ROOT_POSTGRES_DB = 'postgres';

  const POSTGRES_USER = 'APP1_POSTGRES_USER';
  const POSTGRES_PASSWORD = 'APP1_POSTGRES_PASSWORD';
  const POSTGRES_DB = 'app1';

  const POSTGRES_USER2 = 'APP2_POSTGRES_USER';
  const POSTGRES_PASSWORD2 = 'APP2_POSTGRES_PASSWORD';
  const POSTGRES_DB2 = 'app2';

  const POSTGRES_USER3 = 'APP3_POSTGRES_USER';
  const POSTGRES_PASSWORD3 = 'APP3_POSTGRES_PASSWORD';
  const POSTGRES_DB3 = 'app3';

  beforeAll(async () => {
    container = await new GenericContainer('postgres:13.3-alpine')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_DB', ROOT_POSTGRES_DB)
      .withEnv('POSTGRES_USER', ROOT_POSTGRES_USER)
      .withEnv('POSTGRES_PASSWORD', ROOT_POSTGRES_PASSWORD)
      .start();
    await new Promise((resolve) => setTimeout(resolve, 30000));
  });

  afterAll(async () => {
    await container.stop();
  });

  it('check works of database as root user', async () => {
    const pgConfig = {
      user: ROOT_POSTGRES_USER,
      host: container.getHost(),
      password: ROOT_POSTGRES_PASSWORD,
      port: container.getMappedPort(5432),
      database: ROOT_POSTGRES_DB,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('create application database with set command line args ', async () => {
    await execa('npm', [
      'start',
      '--',
      'postgres',
      `--root-database-url=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${ROOT_POSTGRES_DB}?schema=public`,
      `--app-database-url=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${POSTGRES_DB}?schema=public`,
    ]);

    const pgConfig = {
      user: POSTGRES_USER,
      host: container.getHost(),
      password: POSTGRES_PASSWORD,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('duplicate create application database with set command line args ', async () => {
    await execa('npm', [
      'start',
      '--',
      'postgres',
      `--root-database-url=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${ROOT_POSTGRES_DB}?schema=public`,
      `--app-database-url=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${POSTGRES_DB}?schema=public`,
    ]);

    const pgConfig = {
      user: POSTGRES_USER,
      host: container.getHost(),
      password: POSTGRES_PASSWORD,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('drop application database before create application database with set command line args ', async () => {
    await execa('npm', [
      'start',
      '--',
      'postgres',
      '--drop-app-database=true',
      `--root-database-url=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${ROOT_POSTGRES_DB}?schema=public`,
      `--app-database-url=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${POSTGRES_DB}?schema=public`,
    ]);
    expect(true).toEqual(true);

    const pgConfig = {
      user: POSTGRES_USER,
      host: container.getHost(),
      password: POSTGRES_PASSWORD,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('create application 2 database with set command line args ', async () => {
    await execa('npm', [
      'start',
      '--',
      'postgres',
      `--root-database-url=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${ROOT_POSTGRES_DB}?schema=public`,
      `--app-database-url=postgres://${POSTGRES_USER2}:${POSTGRES_PASSWORD2}@${container.getHost()}:${container.getMappedPort(
        5432
      )}/${POSTGRES_DB2}?schema=public`,
    ]);
    expect(true).toEqual(true);

    const pgConfig = {
      user: POSTGRES_USER,
      host: container.getHost(),
      password: POSTGRES_PASSWORD,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('create application database with use envs', async () => {
    const rootDatabaseUrl = `postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(
      5432
    )}/${ROOT_POSTGRES_DB}?schema=public`;

    const appDatabaseUrl = `postgres://${POSTGRES_USER2}:${POSTGRES_PASSWORD2}@${container.getHost()}:${container.getMappedPort(
      5432
    )}/${POSTGRES_DB2}?schema=public`;

    await execa('npm', ['start', '--', 'postgres'], {
      env: {
        ...process.env,
        ROOT_POSTGRES_URL: rootDatabaseUrl,
        POSTGRES_URL: appDatabaseUrl,
      },
    });

    const pgConfig = {
      user: POSTGRES_USER2,
      host: container.getHost(),
      password: POSTGRES_PASSWORD2,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB2,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('create application database with use envs and sub envs', async () => {
    const dbPort = container.getMappedPort(5432).toString();

    const dbHost = container.getHost();

    const rootDatabaseUrl = `postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@\${POSTGRES_HOST}:\${POSTGRES_PORT}/${ROOT_POSTGRES_DB}?schema=public`;

    const appDatabaseUrl = `postgres://${POSTGRES_USER3}:${POSTGRES_PASSWORD3}@\${POSTGRES_HOST}:\${POSTGRES_PORT}/${POSTGRES_DB3}?schema=public`;

    await execa('npm', ['start', '--', 'postgres'], {
      env: {
        ...process.env,
        ROOT_POSTGRES_URL: rootDatabaseUrl,
        POSTGRES_URL: appDatabaseUrl,
        POSTGRES_HOST: dbHost,
        POSTGRES_PORT: dbPort,
      },
    });

    const pgConfig = {
      user: POSTGRES_USER3,
      host: container.getHost(),
      password: POSTGRES_PASSWORD3,
      port: container.getMappedPort(5432),
      database: POSTGRES_DB3,
      idleTimeoutMillis: 30000,
    };
    const client = new Client(pgConfig);
    await client.connect();
    await client.end();
  });

  it('create application database with use envs for nx applications', async () => {
    const dbPort = container.getMappedPort(5432).toString();

    const dbHost = container.getHost();

    const rootDatabaseUrl = `postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@\${POSTGRES_HOST}:\${POSTGRES_PORT}/${ROOT_POSTGRES_DB}?schema=public`;

    const nxApp1DatabaseUrl = `postgres://nx1app:nx1password@\${POSTGRES_HOST}:\${POSTGRES_PORT}/nx1db?schema=public`;
    const nxApp2DatabaseUrl = `postgres://nx2app:nx2password@\${POSTGRES_HOST}:\${POSTGRES_PORT}/nx2db?schema=public`;

    await execa(
      'node',
      [
        resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          './dist/libs/rucken/src/main.js'
        ),
        '--',
        'postgres',
      ],
      {
        cwd: resolve(__dirname, '..', '..', '..', '..', 'integrations/app'),
        env: {
          ...process.env,
          ROOT_POSTGRES_URL: rootDatabaseUrl,
          FEATURE_SERVER_POSTGRES_URL: nxApp1DatabaseUrl,
          SERVER_POSTGRES_URL: nxApp2DatabaseUrl,
          POSTGRES_HOST: dbHost,
          POSTGRES_PORT: dbPort,
        },
      }
    );

    const pgConfigNx1 = {
      user: 'nx1app',
      host: dbHost,
      password: 'nx1password',
      port: +dbPort,
      database: 'nx1db',
      idleTimeoutMillis: 30000,
    };
    const client1 = new Client(pgConfigNx1);
    await client1.connect();
    await client1.end();

    const pgConfigNx2 = {
      user: 'nx2app',
      host: dbHost,
      password: 'nx2password',
      port: +dbPort,
      database: 'nx2db',
      idleTimeoutMillis: 30000,
    };
    const client2 = new Client(pgConfigNx2);
    await client2.connect();
    await client2.end();
  });
});
