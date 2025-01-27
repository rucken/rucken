import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';

@Console()
export class EnvReplacerCommands {
  constructor(private readonly utilsService: UtilsService) {}

  @Command({
    command: 'env-replacer <input>',
    description:
      'recursive replace input value with process environment values',
  })
  envReplacer(input: string) {
    process.stdout.write(this.utilsService.replaceEnv(input));
  }
}
