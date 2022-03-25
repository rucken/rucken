// eslint-disable-next-line @typescript-eslint/no-var-requires
require('source-map-support').install();

import { getLogger } from 'log4js';
import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './lib/app.module';
import { UtilsService } from './lib/utils/utils.service';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  const logger = getLogger(`rucken`);
  logger.level = UtilsService.logLevel();
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    logger.error(e);
    await app.close();
    process.exit(1);
  }
});
