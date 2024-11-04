const JWT = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const config = require("../../../config");
const authService = require("../../../shared/services/db/auth.service");
const userService = require("../../../shared/services/db/user.service");
const {
  BadRequestError,
} = require("../../../shared/globals/helpers/errorHandeler");

class SignIn {
  async read(req, res) {
    const { username, password } = req.body;
    const existingUser = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }
    const passwordMatch = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }
    const user = await userService.getUserById(`${existingUser._id}`);
    const userJwt = JWT.sign({
      userId: user._id,
      uId: existingUser.uId,
      username: existingUser.username,
      email: existingUser.email,
      avatarColor: existingUser.avatarColor,
    });
    req.session = {
      jwt: userJwt,
    };
    res.status(StatusCodes.OK).json({
      message: "User Signed In",
      user,
      token: userJwt,
    });
  }
}
module.exports = SignIn;
