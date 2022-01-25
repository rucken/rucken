import { Module } from '@nestjs/common';
import { GettextModule } from './gettext/gettext.module';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [ToolsModule, GettextModule],
  exports: [ToolsModule, GettextModule],
})
export class AppModule {}
