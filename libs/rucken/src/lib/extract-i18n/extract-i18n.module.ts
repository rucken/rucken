import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { UtilsModule } from '../utils/utils.module';
import { Extracti18nCommands } from './extract-i18n.commands';
import { Extracti18nService } from './extract-i18n.service';

@Module({
  imports: [ConsoleModule, UtilsModule],
  providers: [Extracti18nService],
  exports: [Extracti18nService],
})
export class Extracti18nModule {
  static forRoot(): DynamicModule {
    return {
      module: Extracti18nModule,
      providers: [Extracti18nCommands],
    };
  }
}
