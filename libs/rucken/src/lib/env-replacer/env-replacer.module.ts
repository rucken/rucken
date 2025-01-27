import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from '../../nestjs-console';
import { UtilsModule } from '../utils/utils.module';
import { EnvReplacerCommands } from './env-replacer.commands';

@Module({
  imports: [ConsoleModule, UtilsModule],
})
export class EnvReplacerModule {
  static forRoot(): DynamicModule {
    return {
      module: EnvReplacerModule,
      providers: [EnvReplacerCommands],
    };
  }
}
