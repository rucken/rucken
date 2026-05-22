import { getLogger, Logger } from 'log4js';
import { AppModule } from './lib/app.module';
import { UtilsService } from './lib/utils/utils.service';
import { BootstrapConsole } from './nestjs-console';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});

async function main(): Promise<void> {
  const logger = getLogger('rucken') as Logger;
  logger.level = UtilsService.logLevel();

  const app = await bootstrap.init();
  try {
    await app.init();
    // Scan for decorators after app is initialized to ensure all dependencies are resolved
    if (bootstrap.getOptions().useDecorators) {
      await bootstrap.scanDecorators();
    }
    await bootstrap.boot();
    await app.close();
  } catch (error) {
    logger.error(error);
    await app.close();
    process.exit(1);
  }
}

main();
