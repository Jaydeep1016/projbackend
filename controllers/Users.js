const User = require("../models/user");

const getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        errors: "Users not found",
      });
    }
    return res.send(users);
  });
};

module.exports = getAllUsers;
