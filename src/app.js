const DevTinder = require("./server");
const express = require("express");
const { databaseConnection } = require("./setupDatabase");
const config = require("./config");
const log = config.createLogger("app");

class Application {
  initialize() {
    this.#loadConfig();
    databaseConnection();
    const app = express();
    const server = new DevTinder(app);
    server.start();
    this.#handleExit();
  }
  #loadConfig() {
    config.validateConfig();
    config.configureCloudinary();
  }
  #handleExit() {
    process.on("uncaughtException", (error) => {
      log.error(`There was an uncaught error: ${error}`);
      this.shutDownProperly(1);
    });

    process.on("unhandleRejection", (reason) => {
      log.error(`Unhandled rejection at promise: ${reason}`);
      this.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      log.error("Caught SIGTERM");
      this.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      log.error("Caught SIGINT");
      this.shutDownProperly(2);
    });

    process.on("exit", () => {
      log.error("Exiting");
    });
  }
  shutDownProperly(exitCode) {
    Promise.resolve()
      .then(() => {
        log.info("Shutting down");
        process.exit(exitCode);
      })
      .catch((err) => {
        log.error(`Error during shutdown: ${err}`);
        process.exit(1);
      });
  }
}

const application = new Application();

application.initialize();
