import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { ToolsModule } from '../tools/tools.module';
import { TranslateModule } from '../translate/translate.module';
import { UtilsModule } from '../utils/utils.module';
import { PrepareCommands } from './prepare.commands';

@Module({
  imports: [ConsoleModule, UtilsModule, TranslateModule, ToolsModule],
})
export class PrepareModule {
  static forRoot(): DynamicModule {
    return {
      module: PrepareModule,
      providers: [PrepareCommands],
    };
  }
}
