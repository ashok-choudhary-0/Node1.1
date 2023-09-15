const users = require("../models/users");
const roles = require("../models/roles")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const addUser = async (req, res) => {
  try {
    let {username,password,confirmPassword,email,firstName,lastName,roleId} = req.body
    if (req.body.password === req.body.confirmPassword) {
      const searchIdInRoles = await roles.findOne({ where: { id: roleId } })
      if (searchIdInRoles) {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newUser = { email,firstName,lastName,roleId,username, password: hashedPassword, confirmPassword: hashedPassword }
        const addedUser = await users.create(newUser);
        res.status(200).send(addedUser);
      }else{
        res.status(500).send("role id not found")
      }
    } else {
      res.status(500).send("password and confirmPassword should be same")
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { addUser }