const userModel = require("../models/user");
const roles = require("../models/roles")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const register = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, firstName, lastName, roleId } = req.body
    if (password === confirmPassword) {
      const searchIdInRoles = await roles.findOne({ where: { id: roleId } })
      if (searchIdInRoles) {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newUser = { email, firstName, lastName, roleId, username, password: hashedPassword }
        const addedUser = await userModel.create(newUser);
        res.status(200).send(addedUser);
      } else {
        res.status(500).send({ message: "role id not found" })
      }
    } else {
      res.status(500).send({ message: "password and confirmPassword should be same" })
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { register }