const express = require("express");
const SignIn = require("../controllers/signin");
const SignOut = require("../controllers/signout");
class AuthRoutes {
  #router;
  routertest;
  constructor() {
    this.#router = express.Router();
  }
  routes() {
    // this.#router.post("/signup", SignUp.prototype.create);
    this.#router.post("/signin", SignIn.prototype.read);
    // this.#router.post("/forgot-password", Password.prototype.create);
    // this.#router.post("/reset-password/:token", Password.prototype.update);
    this.#router.get("/test-auth", (req, res) => {
      res.send("Hello from auth routes");
    });
    return this.#router;
  }
  signOutRoute() {
    this.#router.get("/signout", SignOut.prototype.update);
    return this.#router;
  }
}
const authRoutes = new AuthRoutes();

module.exports = authRoutes;
