import { Module } from '@nestjs/common';
import { CopyPasteModule } from './copy-paste/copy-paste.module';
import { EnvReplacerModule } from './env-replacer/env-replacer.module';
import { Extracti18nModule } from './extract-i18n/extract-i18n.module';
import { GettextModule } from './gettext/gettext.module';
import { PostgresModule } from './postgres/postgres.module';
import { PrepareModule } from './prepare/prepare.module';
import { ToolsModule } from './tools/tools.module';
import { TranslateModule } from './translate/translate.module';
import { MigrateModule } from './migrate/migrate.module';

@Module({
  imports: [
    ToolsModule.forRoot(),
    GettextModule.forRoot(),
    Extracti18nModule.forRoot(),
    TranslateModule.forRoot(),
    PrepareModule.forRoot(),
    PostgresModule.forRoot(),
    EnvReplacerModule.forRoot(),
    CopyPasteModule.forRoot(),
    MigrateModule.forRoot(),
  ],
})
export class AppModule {}
