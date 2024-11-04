const dotenv = require("dotenv");
dotenv.config();
const bunyan = require("bunyan");
const cloudinary = require("cloudinary").v2;
console.log(process.env.NODE_ENV);
class Config {
  DATABASE_URL;
  JWT_TOKEN;
  NODE_ENV;
  SECRET_KEY_ONE;
  SECRET_KEY_TWO;
  CLIENT_URL;
  REDIS_HOST;
  CLOUD_NAME;
  CLOUD_API_KEY;
  CLOUD_API_SECRET;
  SENDER_EMAIL;
  SENDER_EMAIL_PASSWORD;
  SENDGRID_API_KEY;
  SENDGRID_SENDER;
  EC2_URL;
  #DEFAULT_DATABASE_URL = "mongodb://localhost:27017/devTrinder";
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.#DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1234";
    this.NODE_ENV = process.env.NODE_ENV || "something";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "something";
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "something";
    this.CLIENT_URL = process.env.CLIENT_URL || "something";
    this.REDIS_HOST = process.env.REDIS_HOST || "something";
    this.CLOUD_NAME = process.env.CLOUD_NAME || "something";
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "something";
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "something";
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || "something";
    this.SENDER_EMAIL_PASSWORD =
      process.env.SENDER_EMAIL_PASSWORD || "something";
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "something";
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || "something";
    this.EC2_URL = process.env.EC2_URL || "something";
  }
  createLogger(name) {
    return bunyan.createLogger({ name, level: "debug" });
  }
  validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined || value === "") {
        throw new Error(`Missing environment variable ${key}`);
      }
    }
  }
  configureCloudinary() {
    cloudinary.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET,
    });
  }
}

const config = new Config();
module.exports = config;
