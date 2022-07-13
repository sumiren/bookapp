import { NodeApp } from "./node-app";

import { debug as createDebug } from "debug";

import http from "http";

process.env.ENVIRONMENT = process.env.ENVIRONMENT ?? "local";
process.env.LOCAL_NODE_PORT = process.env.LOCAL_NODE_PORT ?? "3001";
process.env.ASSET_DOMAIN_NAME_WITH_SCHEME =
  process.env.ASSET_DOMAIN_NAME_WITH_SCHEME ?? "http://localhost:3000";
process.env.BOOK_TABLE_NAME = process.env.BOOK_TABLE_NAME ?? "books";

const debug = createDebug("startup:server");
/**
 * Module dependencies.
 */

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.LOCAL_NODE_PORT);

/**
 * Create HTTP server.
 */
const server = http.createServer(NodeApp.app());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind =
    typeof port === "string" ? `Pipe ${port}` : `Port ${port as number}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr!.port}`;
  debug(`Listening on ${bind}`);
}
