import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export async function saveBasicMigrationsToFileSystem(dir: string) {
  const filenames = Object.keys(BASIC_MIGRATIONS);
  for (const filename of filenames) {
    const filecontent = BASIC_MIGRATIONS[filename];
    const fullfulepath = join(dir, filename);
    await mkdir(dirname(fullfulepath), { recursive: true });
    await writeFile(fullfulepath, filecontent);
  }
}

export const BASIC_MIGRATIONS = {
  'apps/server/src/migrations/V202401010900__CreateUserTable.sql': `-- CreateTable
CREATE TABLE "AppUserCategory"(
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    name varchar(512) NOT NULL,
    description text,
    "deletedBy" uuid,
    "createdBy" uuid,
    "updatedBy" uuid,
    "deletedAt" timestamp(6),
    "createdAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_APP_USER_CATEGORY" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_APP_USER_CATEGORY" ON "AppUserCategory"("name");

CREATE INDEX IF NOT EXISTS "IDX_APP_USER_CATEGORY__DELETED" ON "AppUserCategory"(( CASE WHEN "deletedAt" IS NULL THEN
    FALSE
ELSE
    TRUE
END));

-- CreateTable
CREATE TABLE "AppUser"(
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "categoryId" uuid CONSTRAINT "FK_APP_USER__CATEGORY_ID" REFERENCES "AppUserCategory",
    "externalUserId" uuid NOT NULL,
    "deletedBy" uuid,
    "createdBy" uuid,
    "updatedBy" uuid,
    "deletedAt" timestamp(6),
    "createdAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_APP_USER" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_APP_USER" ON "AppUser"("externalUserId");

CREATE INDEX IF NOT EXISTS "IDX_APP_USER__DELETED" ON "AppUser"(( CASE WHEN "deletedAt" IS NULL THEN
    FALSE
ELSE
    TRUE
END));

CREATE INDEX "IDX_APP_USER__CATEGORY_ID" ON "AppUser"("categoryId");

`,
  'apps/server/src/migrations/objects/R__SetAllComments.sql': `COMMENT ON TABLE "AppUser" IS 'Application users';
COMMENT ON TABLE "AppUserCategory" IS 'Application user categories';`,
  'libs/server/src/migrations/seeds/R__DefaultCategories.sql': `INSERT INTO "AppUserCategory" (name, description) VALUES ('VIP', 'Users with VIP status') ON CONFLICT (name) DO NOTHING;`,
};
