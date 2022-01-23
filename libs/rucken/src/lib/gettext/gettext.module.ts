import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { GettextConfigService } from './gettext-config.service';
import { GettextCommands } from './gettext.commands';
import { GettextService } from './gettext.service';

@Module({
  imports: [ConsoleModule],
  providers: [GettextConfigService, GettextService, GettextCommands],
  exports: [GettextService],
})
export class GettextModule {}
