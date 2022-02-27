import { getText } from 'class-validator-multi-lang';

export class CliUser {
  static strings = {
    id: getText('CliUser Id'),
    username: getText('CliUser {{Username}}'),
    password: getText('CliUser Password'),
  };
}
