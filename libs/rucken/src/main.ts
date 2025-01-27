import { getLogger } from 'log4js';
import { AppModule } from './lib/app.module';
import { UtilsService } from './lib/utils/utils.service';
import { BootstrapConsole } from './nestjs-console';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});

async function main() {
  const logger = getLogger(`rucken`);
  logger.level = UtilsService.logLevel();
  const app = await bootstrap.init();
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    logger.error(e);
    await app.close();
    process.exit(1);
  }
}

main();
