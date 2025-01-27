import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from '../../nestjs-console';
import { Extracti18nModule } from '../extract-i18n/extract-i18n.module';
import { GettextModule } from '../gettext/gettext.module';
import { UtilsModule } from '../utils/utils.module';
import { TranslateCommands } from './translate.commands';

@Module({
  imports: [ConsoleModule, UtilsModule, Extracti18nModule, GettextModule],
  exports: [Extracti18nModule, GettextModule],
})
export class TranslateModule {
  static forRoot(): DynamicModule {
    return {
      module: TranslateModule,
      providers: [TranslateCommands],
    };
  }
}
