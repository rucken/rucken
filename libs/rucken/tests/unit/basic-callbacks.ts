import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export async function saveBasicMigrationsToFileSystem(dir: string) {
  const filenames = Object.keys(BASIC_CALLBACKS);
  for (const filename of filenames) {
    const filecontent = BASIC_CALLBACKS[filename];
    const fullfulepath = join(dir, filename);
    await mkdir(dirname(fullfulepath), { recursive: true });
    await writeFile(fullfulepath, filecontent);
  }
}

export const BASIC_CALLBACKS = {
  'apps/server/src/migrations/beforeMigrate.sql': `CREATE TABLE IF NOT EXISTS "CallbackTable"(
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    name varchar(512) NOT NULL,
    "createdAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_CALLBACK_TABLE" PRIMARY KEY ("id")
);`,
  'apps/server/src/migrations/beforeRepeatables.sql': `INSERT INTO "CallbackTable" (name) VALUES ('beforeRepeatables - %filename%');`,
  'apps/server/src/migrations/beforeEachMigrate.sql': `INSERT INTO "CallbackTable" (name) VALUES ('beforeEachMigrate - %filename%');`,
  'apps/server/src/migrations/beforeEachMigrateStatement.sql': `INSERT INTO "CallbackTable" (name) VALUES ('beforeEachMigrateStatement - %filename%');`,
  'apps/server/src/migrations/afterEachMigrateStatement.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterEachMigrateStatement - %filename%');`,
  'apps/server/src/migrations/afterEachMigrateStatementError.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterEachMigrateStatementError - %filename%');`,
  'apps/server/src/migrations/afterEachMigrate.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterEachMigrate - %filename%');`,
  'apps/server/src/migrations/afterEachMigrateError.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterEachMigrateError - %filename%');`,
  'apps/server/src/migrations/afterMigrate.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterEachMigrate - %filename%');`,
  'apps/server/src/migrations/afterMigrateApplied.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterMigrateApplied - %filename%');`,
  'apps/server/src/migrations/afterVersioned.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterVersioned - %filename%');`,
  'apps/server/src/migrations/afterMigrateError.sql': `INSERT INTO "CallbackTable" (name) VALUES ('afterMigrateError - %filename%');`,
};
