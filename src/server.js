const cors = require("cors");
const helmet = require("helmet");
const Logger = require("bunyan");
const compression = require("compression");
const { StatusCodes } = require("http-status-codes");
const cookieSession = require("cookie-session");
const hpp = require("hpp");
const apiStats = require("swagger-stats");
const http = require("http");
const { applicationRoutes } = require("./routes");
const config = require("./config");
const { json } = require("express");
const express = require("express");
const log = config.createLogger("server");
class DevTinder {
  #App;
  constructor(app) {
    this.#App = app;
  }
  start() {
    this.#securityMiddleware(this.#App);
    this.#standardMiddleware(this.#App);
    this.#routesMiddleware(this.#App);
    // this.apiMonitoringMiddleware(this.#App);
    this.#globalErrorHandler(this.#App);
    this.#startServer(this.#App);
  }
  #securityMiddleware(app) {
    app.set("trust proxy", 1);
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 24 * 7 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        // sameSite:'none'
        //same site should be used in production
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: StatusCodes.OK,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      })
    );
  }
  #standardMiddleware(app) {
    app.use(compression());
    app.use(express.json());
    app.use(json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  }
  #routesMiddleware(app) {
    applicationRoutes(app);
  }
  #apiMonitoring(app) {
    app.use(
      apiStats.getMiddleware({
        uriPath: "/api-monitoring",
      })
    );
  }
  #globalErrorHandler(app) {
    app.all("*", (req, res) => {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `${req.originalUrl} not found`,
      });
    });
    app.use((error, _req, res, next) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }
  #startServer(app) {
    if (!config.JWT_TOKEN) {
      throw new Error("Missing JWT Token");
    }
    try {
      const httpServer = new http.Server(app);
      this.#startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }
  #startHttpServer(httpServer) {
    log.info(`Worker with process id of ${process.pid} has started...`);
    log.info(`Server has started with process id ${process.pid}`);
    httpServer.listen(config.SERVER_PORT || 8080, () => {
      log.info(`Server is running on port ${config.SERVER_PORT || 8080}`);
    });
  }
}
module.exports = DevTinder;
