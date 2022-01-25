import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { UtilsModule } from '../utils/utils.module';
import { ToolsCommands } from './tools.commands';
import { ToolsService } from './tools.service';

@Module({
  imports: [ConsoleModule, UtilsModule],
  providers: [ToolsService, ToolsCommands],
  exports: [ToolsService],
})
export class ToolsModule {}
