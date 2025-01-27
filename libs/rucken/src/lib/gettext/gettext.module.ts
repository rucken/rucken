import { DynamicModule, Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { GettextCommands } from './gettext.commands';
import { GettextService } from './gettext.service';
import { ConsoleModule } from '../../nestjs-console';

@Module({
  imports: [ConsoleModule, UtilsModule],
  providers: [GettextService],
  exports: [GettextService],
})
export class GettextModule {
  static forRoot(): DynamicModule {
    return {
      module: GettextModule,
      providers: [GettextCommands],
    };
  }
}
