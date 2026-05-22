/**
 * @module ConsoleScanner
 */
import { INestApplicationContext } from '@nestjs/common';

import { COMMAND_METADATA_NAME, CONSOLE_METADATA_NAME } from './constants';
import { CreateCommandOptions } from './decorators';
import { ModulesContainer, NestContainer } from '@nestjs/core';
import type { Module } from '@nestjs/core/injector/module';

/**
 * The interface for command method metadata
 */
export interface MethodsMetadata {
  name: string;
  metadata: CreateCommandOptions;
}

/**
 * The response of the scanner
 */
export interface ScanResponse {
  instance: unknown;
  metadata: CreateCommandOptions;
  methods: MethodsMetadata[];
}

export class ConsoleScanner {
  /**
   * Get all the modules
   */
  private getModules(
    modulesContainer: ModulesContainer,
    include: unknown[] = [],
  ): Module[] {
    const allModules = [...modulesContainer.values()];
    if (!include.length) {
      return allModules;
    }
    return allModules.filter(({ metatype }) =>
      include.some((item) => item === metatype),
    );
  }

  /**
   * Get a list of classes methods
   */
  private getInstanceMethods(instance: unknown): string[] {
    const instanceObj = instance as Record<string, unknown>;
    const prototype = Object.getPrototypeOf(instanceObj);

    return [
      ...Object.getOwnPropertyNames(instanceObj),
      ...Object.getOwnPropertyNames(prototype),
    ].filter((m) => Reflect.hasMetadata(COMMAND_METADATA_NAME, instanceObj, m));
  }

  /**
   * Scan an application
   * @param app
   * @param includedModules
   */
  public async scan(
    app: INestApplicationContext,
    includedModules?: unknown[],
  ): Promise<Set<ScanResponse>> {
    const set = new Set<ScanResponse>();
    const container = (app as unknown as Record<string, unknown>)
      .container as NestContainer;
    const modules = this.getModules(container.getModules(), includedModules);

    await Promise.all(
      modules.map(async (module) => {
        await Promise.all(
          Array.from(module.providers.values()).map(async (provider) => {
            const { metatype, token } = provider;
            if (typeof metatype !== 'function') {
              return;
            }

            // ignore providers without instance
            if (!provider.instance) {
              return;
            }

            const consoleMetadata = Reflect.getMetadata(
              CONSOLE_METADATA_NAME,
              provider.instance.constructor,
            ) as CreateCommandOptions | undefined;

            // ignore providers without the console decorator
            if (!consoleMetadata) {
              return;
            }

            // Use the already-created provider instance from the container
            // This instance has all dependencies injected by NestJS
            const instance = provider.instance;
            const methods = this.getInstanceMethods(instance);

            // get the metadata of the methods
            const methodsMetadata = methods.map<MethodsMetadata>(
              (methodName) => ({
                name: methodName,
                metadata: Reflect.getMetadata(
                  COMMAND_METADATA_NAME,
                  instance,
                  methodName,
                ) as CreateCommandOptions,
              }),
            );

            set.add({
              instance,
              metadata: consoleMetadata,
              methods: methodsMetadata,
            });
          }),
        );
      }),
    );

    return set;
  }
}
