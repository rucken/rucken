/**
 * @module Decorators
 */
import { Inject } from '@nestjs/common';

import {
  CLI_SERVICE_TOKEN,
  COMMAND_METADATA_NAME,
  CONSOLE_METADATA_NAME,
} from './constants';

export type ParserType = (value: string, previous: unknown) => unknown;

/**
 * A Param decorator to inject the root cli
 */
export const InjectCli = (): ParameterDecorator => Inject(CLI_SERVICE_TOKEN);

/**
 * The options of the command
 * @see commander .option() to learn more
 */
export interface CommandOption {
  /**
   * The flags the command uses eg '-p,--port'
   */
  flags: string;

  /**
   * The description of the option
   */
  description?: string;

  /**
   * The function to parse the value
   */
  fn?: ParserType;

  /**
   * The default value
   */
  defaultValue?: unknown;

  /**
   * True if the option is required
   */
  required?: boolean;
}

/**
 * The interface to create a command
 */
export interface CreateCommandOptions {
  /**
   * The command with arguments
   *
   * eg: "mycommand <myargument> <mysecondargument>"
   * @see commander .command() method for more details
   */
  command: string;

  /**
   * The description of the command
   */
  description?: string;

  /**
   * The alias of the command
   */
  alias?: string;

  /**
   * A list of command options
   */
  options?: CommandOption[];
}

/**
 * The Command decorator is used to decorate a method in a class
 * You can use it in a class that is decorated by a "@Console" decorator
 */
export const Command =
  (options: CreateCommandOptions): MethodDecorator =>
  // @ts-expect-error - Target type compatibility with MethodDecorator
  (target: Record<string, unknown>, method: string | symbol): void =>
    Reflect.defineMetadata(COMMAND_METADATA_NAME, options, target, method);

/**
 * The Console decorator is used to decorate a class
 * All commands in class that are decorated by a "@Console" with identical name will be grouped
 *
 * eg "@Console({name: "mycommand"})"
 */
export const Console =
  (options?: CreateCommandOptions): ClassDecorator =>
  // @ts-expect-error - Target type compatibility with ClassDecorator
  (target: Record<string, unknown>): void =>
    Reflect.defineMetadata(CONSOLE_METADATA_NAME, options || {}, target);
