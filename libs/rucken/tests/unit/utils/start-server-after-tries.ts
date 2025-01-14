import type { Server } from 'node:net';

/**
 * Starts the server, incrementing the port each time if the port is already taken
 * Tries @param tries times
 * Returns the port that was successfully started
 * @param lite
 * @param port
 * @param tries
 */
export const startServerAfterTries = (
  server: Server,
  tries = 5
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tryStart = (tries: number) => {
      if (tries === 0) {
        reject(new Error('Could not start server'));
        return;
      }

      server.on('error', (error: any) => {
        console.log('Error handling going');
        if (error.code === 'EADDRINUSE') {
          tryStart(tries - 1);
        }
      });

      server.listen(0, () => {
        const address = server.address();

        if (!address || typeof address === 'string') {
          throw new Error('Could not start server');
        }

        resolve(address.port);
      });
    };

    tryStart(tries);
  });
};
