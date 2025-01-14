import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { ToolsModule } from '../tools/tools.module';
import { TranslateModule } from '../translate/translate.module';
import { UtilsModule } from '../utils/utils.module';
import { MigrateCommands } from './migrate.commands';
import { MigrateService } from './migrate.service';
import { HistoryTableService } from './history-table.service';

@Module({
  imports: [ConsoleModule, UtilsModule, TranslateModule, ToolsModule],
  providers: [HistoryTableService, MigrateService],
  exports: [HistoryTableService, MigrateService],
})
export class MigrateModule {
  static forRoot(): DynamicModule {
    return {
      module: MigrateModule,
      providers: [MigrateCommands],
    };
  }
}
