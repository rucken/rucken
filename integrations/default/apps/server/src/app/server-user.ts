import { getText } from 'class-validator-multi-lang';

export class ServerUsers {
  static strings = {
    id: getText('ServerUser Id'),
    username: getText('ServerUser Username'),
    password: getText('ServerUserPassword'),
  };
}
