import { Command, Console } from '../../nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_COPY_PASTE_CONFIG } from './copy-paste.config';
import { CopyPasteService } from './copy-paste.service';

@Console()
export class CopyPasteCommands {
  private readonly config = this.utilsService.getRuckenConfig(
    DEFAULT_COPY_PASTE_CONFIG
  ).copyPaste;

  constructor(
    private readonly copyPasteService: CopyPasteService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    alias: 'cp',
    command: 'copy-paste',
    description:
      'copy paste source files to destination with singular and plural replace text in file contents and file paths',
    options: [
      {
        flags: '-p,--path [strings]',
        description:
          'the path with the source code to copy, it uses the current CWD if it is not defined, default: "." (example: ../../src)',
      },
      {
        flags: '-f,--find [strings]',
        description: 'source singular text in kebab-case (example: user-role)',
        required: true,
      },
      {
        flags: '-fp,--find-plural [strings]',
        description:
          'source text in plural in kebab-case, if not defined, it will be automatically detected programmatically (example: user-rules)',
      },
      {
        flags: '-r,--replace [strings]',
        description:
          'destination singular text in kebab-case (example: user-company)',
        required: true,
      },
      {
        flags: '-rp,--replace-plural [strings]',
        description:
          'destination text in plural in kebab-case, if not defined, it will be automatically detected programmatically (example: user-companies)',
      },
      {
        flags: '-d,--dest-path [strings]',
        description:
          'the path with the destination code to paste, it uses the "path" if it is not defined, default: "." (example: ../../src)',
      },
      {
        flags: '-e,--extensions [strings]',
        description:
          'extensions of files for copy paste, default: "ts,html,htm,scss,css,txt,json,yaml,yml,xml,js.esm,sh" (example: py,ini)',
      },
      {
        flags: '-gr,--glob-rules [strings]',
        description: 'match files using the patterns the shell uses',
      },
      {
        flags: '-re,--replace-envs [strings]',
        description:
          'do you need to replace environment variables when copying, you can specify a template, the default template is %key% (examples: "true", "%key%", "${key}")',
      },
    ],
  })
  async copyPaste({
    path,
    find,
    findPlural,
    replace,
    replacePlural,
    destPath,
    extensions,
    globRules,
    replaceEnvs,
  }: {
    path?: string;
    find: string;
    findPlural?: string;
    replace: string;
    replacePlural?: string;
    destPath?: string;
    extensions?: string;
    globRules?: string;
    replaceEnvs?: string;
  }) {
    this.copyPasteService.setLogger(CopyPasteService.title);
    await this.copyPasteService.copyPasteHandler({
      path,
      find,
      findPlural,
      replace,
      replacePlural,
      destPath,
      extensions: (extensions || this.config.extensions)
        .split(',')
        .map((s) => s.trim()),
      cases: this.config.cases,
      globRules,
      replaceEnvs: replaceEnvs
        ? replaceEnvs.includes('key')
          ? replaceEnvs
          : this.config.replaceEnvsKeyPattern
        : undefined,
    });
  }
}
