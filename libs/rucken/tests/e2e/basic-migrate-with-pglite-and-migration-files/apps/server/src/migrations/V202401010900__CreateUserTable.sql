-- CreateTable
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