const { hash, compare } = require("bcryptjs");
const { model, Schema } = require("mongoose");
const SALT_ROUND = 10;
const authSchema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: { type: Number },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);
authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, SALT_ROUND);
  }
  next();
});
authSchema.methods.comparePassword = async function (password) {
  const hasedPassword = this.password;
  return await compare(password, hasedPassword);
};
authSchema.methods.hasedPassword = async function (password) {
  return await hash(password, SALT_ROUND);
};
const AuthModel = model("Auth", authSchema);
module.exports = AuthModel;
