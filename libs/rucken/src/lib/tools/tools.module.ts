import { DynamicModule, Module } from '@nestjs/common';
import { ConsoleModule } from '../../nestjs-console';
import { UtilsModule } from '../utils/utils.module';
import { MakeTsListCommands } from './make-ts-list.commands';
import { MakeTsListService } from './make-ts-list.service';
import { VersionUpdaterCommands } from './version-updater.commands';
import { VersionUpdaterService } from './version-updater.service';

@Module({
  imports: [ConsoleModule, UtilsModule],
  providers: [VersionUpdaterService, MakeTsListService],
  exports: [VersionUpdaterService, MakeTsListService],
})
export class ToolsModule {
  static forRoot(): DynamicModule {
    return {
      module: ToolsModule,
      providers: [MakeTsListCommands, VersionUpdaterCommands],
    };
  }
}
