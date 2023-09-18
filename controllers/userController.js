const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getRole } = require("../controllers/rolesController")
const userRegister = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, firstName, lastName, roleId } = req.body
    if (password === confirmPassword) {
      const searchIdInRoles = await getRole(roleId)
      if (searchIdInRoles) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const addedUser = await userModel.create({ email, firstName, lastName, roleId, username, password: hashedPassword });
        res.status(200).send(addedUser);
      } else {
        res.status(500).send({ message: "role id not found" })
      }
    } else {
      res.status(500).send({ message: "password and confirmPassword doesn't match" })
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const dbUser = await userModel.findOne({ where: { username: username } })
    if (dbUser) {
      const passwordMatch = await bcrypt.compare(password, dbUser.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: dbUser.id, username: dbUser.username, password: dbUser.password }, process.env.secKey);
        res.status(200).send({ dbUser, token })
      } else {
        res.status(500).send({ message: "incorrect password" })
      }
    } else {
      res.status(500).send({ message: "user not found" })
    }

  } catch (err) {
    res.status(500).send(err)
  }

}

module.exports = { userRegister, login }
