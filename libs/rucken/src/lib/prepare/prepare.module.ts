import { DynamicModule, Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module';
import { TranslateModule } from '../translate/translate.module';
import { UtilsModule } from '../utils/utils.module';
import { PrepareCommands } from './prepare.commands';
import { ConsoleModule } from '../../nestjs-console';

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
