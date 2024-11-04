const mongoose = require("mongoose");
const { indexOf } = require("lodash");
const AuthModel = require("../../../features/auth/models/auth.schema");
const UserModel = require("../../../features/user/model/user.schema");
class UserService {
  async addUserData(data) {
    const user = new UserModel(data);
    await user.save();
  }
  async updatePassword(username, hashedPassword) {
    await AuthModel.updateOne(
      { username },
      {
        $set: {
          password: hashedPassword,
        },
      }
    ).exec();
  }
  async updateUserInfo(userId, info) {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          work: info["work"],
          school: info["school"],
          location: info["location"],
          quote: info["quote"],
        },
      }
    ).exec();
  }
  async updateSocialLinks(userId, links) {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { social: links },
      }
    ).exec();
  }
  async updateNotificationSettings(userId, settings) {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { notifications: settings },
      }
    );
  }
  async getUserById(userId) {
    const users = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "Auth",
          localField: "authId",
          foreignField: "_id",
          as: "authId",
        },
      },
      {
        $unwind: "$authId",
      },
      {
        $project: this.#aggregateProject(),
      },
    ]);
    return users[0];
  }
  async getUserByAuthId(authId) {
    const users = await UserModel.aggregate([
      {
        $match: {
          authId: new mongoose.Types.ObjectId(authId),
        },
      },
      {
        $lookup: {
          from: "Auth",
          localField: "authId",
          foreignField: "_id",
          as: "authId",
        },
      },
      {
        $unwind: "$authId",
      },
      {
        $project: this.#aggregateProject(),
      },
    ]);
    return users[0];
  }
  async getAllUsers(userId, skip, limit) {
    const users = await UserModel.aggregate([
      {
        $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "Auth",
          localField: "authId",
          foreignField: "_id",
          as: "authId",
        },
      },
      {
        $unwind: "$authId",
      },
      {
        $project: this.#aggregateProject(),
      },
    ]);
    return users;
  }
  async getRandomUsers(userId) {
    const randomUsers = [];
    const users = await UserModel.aggregate([
      { $match: { _id: { $_ne: new mongoose.Types.ObjectId(userId) } } },
      {
        $lookup: {
          from: "Auth",
          localField: "authId",
          foreignField: "_id",
          as: "authId",
        },
      },
      {
        $unwind: "authId",
      },
      { $sample: { size: 10 } },
      {
        $addFields: {
          username: "$authId.username",
          uId: "$authId.uId",
          email: "$authId.email",
          avatarColor: "$authId.avatarColor",
          createdAt: "$authId.createdAt",
        },
      },
      {
        $project: {
          authId: 0,
          __V: 0,
        },
      },
    ]);
  }

  #aggregateProject() {
    return {
      _id: 1,
      username: "$authId.username",
      uId: "$authId.uId",
      email: "$authId.email",
      avatarColor: "$authId.avatarColor",
      createdAt: "$authId.createdAt",
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1,
    };
  }
}
const userService = new UserService();
module.exports = userService;
