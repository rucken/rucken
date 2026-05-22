// Application Module
export * from './lib/app.module';

// Copy-Paste Feature
export * from './lib/copy-paste/copy-paste.commands';
export * from './lib/copy-paste/copy-paste.config';
export * from './lib/copy-paste/copy-paste.module';
export * from './lib/copy-paste/copy-paste.service';

// Env-Replacer Feature
export * from './lib/env-replacer/env-replacer.commands';
export * from './lib/env-replacer/env-replacer.module';

// Extract-i18n Feature
export * from './lib/extract-i18n/extract-i18n.commands';
export * from './lib/extract-i18n/extract-i18n.config';
export * from './lib/extract-i18n/extract-i18n.module';
export * from './lib/extract-i18n/extract-i18n.service';

// Gettext Feature
export * from './lib/gettext/gettext-to-messageformat';
export * from './lib/gettext/gettext.commands';
export * from './lib/gettext/gettext.config';
export * from './lib/gettext/gettext.module';
export * from './lib/gettext/gettext.service';
export * from './lib/gettext/i18next-conv';
export * from './lib/gettext/po2json';

// Migrate Feature
export * from './lib/migrate/migrate.commands';
export * from './lib/migrate/migrate.config';
export * from './lib/migrate/migrate.module';

// Postgres Feature
export * from './lib/postgres/postgres.commands';
export * from './lib/postgres/postgres.config';
export * from './lib/postgres/postgres.module';

// Prepare Feature
export * from './lib/prepare/prepare.commands';
export * from './lib/prepare/prepare.module';

// Tools Feature
export * from './lib/tools/make-ts-list.commands';
export * from './lib/tools/make-ts-list.service';
export * from './lib/tools/tools.config';
export * from './lib/tools/tools.module';
export * from './lib/tools/version-updater.commands';
export * from './lib/tools/version-updater.service';

// Translate Feature
export * from './lib/translate/translate.commands';
export * from './lib/translate/translate.module';

// Utils
export * from './lib/utils/cross-path-sort';
export * from './lib/utils/utils.module';
export * from './lib/utils/utils.service';

// NestJS Console - Public API
export * from './nestjs-console/constants';
export * from './nestjs-console/decorators';
export * from './nestjs-console/interfaces';
export * from './nestjs-console/module';
export * from './nestjs-console/scanner';
export * from './nestjs-console/service';
export * from './nestjs-console/bootstrap/abstract';
export * from './nestjs-console/bootstrap/console';

// NestJS Console - Deprecated (use specific exports above)
export * from './nestjs-console/index';
