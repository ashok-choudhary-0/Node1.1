const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const { getRole } = require("../controllers/rolesController")
const { validateToken } = require("../middlewares/userMiddleWare")
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
        res.status(200).send(dbUser)
      } else {
        res.status(500).send({ message: "incorrect password please try again" })
      }
    } else {
      res.status(500).send({ message: "user not found" })
    }

  } catch (err) {
    res.status(500).send(err)
  }

}

const getData = async (req, res) => {
  try {
    const userData = await userModel.findOne({ where: { id: req.headers.token } })
    if (userData) {
      res.status(200).send(userData)
    } else {
      res.status(500).send({ message: "invalid token" })
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}

module.exports = { userRegister, login, validateToken, getData }
