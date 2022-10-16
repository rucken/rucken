import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { UtilsModule } from '../utils/utils.module';
import { CopyPasteCommands } from './copy-paste.commands';
import { CopyPasteService } from './copy-paste.service';

@Module({
  imports: [ConsoleModule, UtilsModule],
  providers: [CopyPasteService],
  exports: [CopyPasteService],
})
export class CopyPasteModule {
  static forRoot(): DynamicModule {
    return {
      module: CopyPasteModule,
      providers: [CopyPasteCommands],
    };
  }
}
