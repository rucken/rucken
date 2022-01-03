import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { ToolsConfigService } from './tools-config.service';
import { ToolsCommands } from './tools.commands';
import { ToolsService } from './tools.service';

@Module({
  imports: [ConsoleModule],
  providers: [ToolsConfigService, ToolsService, ToolsCommands],
  exports: [ToolsService],
})
export class ToolsModule {}
