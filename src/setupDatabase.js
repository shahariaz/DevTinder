const mongoose = require("mongoose");
const Logger = require("bunyan");
const config = require("./config");

const log = config.createLogger("setupDatabase");
exports.databaseConnection = () => {
  const connect = async () => {
    try {
      await mongoose.connect(config.DATABASE_URL);
      log.info("Database connected successfully");
    } catch (error) {
      log.error("Error connecting to database", error);
      return process.exit(1);
    }
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
