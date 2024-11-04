const { StatusCodes } = require("http-status-codes");

class SignOut {
  async update(req, res) {
    req.session = null;
    res.status(StatusCodes.OK).json({
      message: "Logged out successfully",
      user: {},
      token: null,
      refreshToken: null,
    });
  }
}
module.exports = SignOut;
