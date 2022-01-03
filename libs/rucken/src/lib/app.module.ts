import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [ToolsModule],
  exports: [ToolsModule],
})
export class AppModule {}
