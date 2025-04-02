import { DynamicModule, Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module';
import { TranslateModule } from '../translate/translate.module';
import { UtilsModule } from '../utils/utils.module';
import { PostgresCommands } from './postgres.commands';
import { ConsoleModule } from '../../nestjs-console';

@Module({
  imports: [ConsoleModule, UtilsModule, TranslateModule, ToolsModule],
})
export class PostgresModule {
  static forRoot(): DynamicModule {
    return {
      module: PostgresModule,
      providers: [PostgresCommands],
    };
  }
}
