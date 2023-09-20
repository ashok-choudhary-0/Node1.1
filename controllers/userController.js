const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const { getRole } = require("../controllers/rolesController")
const md5 = require('md5');
const accessTokenModel = require("../models/access_token");
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

const saveToken = async (id, token) => {
  const currentTime = new Date();
  const expiry = new Date(currentTime).setHours(currentTime.getHours() + 1);
  const isUserAlreadyExist = await accessTokenModel.findOne({ where: { user_id: id } })
  if (isUserAlreadyExist) {
    await accessTokenModel.update({ access_token: token, expiry: expiry }, { where: { user_id: id } })
  } else {
    await accessTokenModel.create({ user_id: id, access_token: token, expiry: expiry })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const dbUser = await userModel.findOne({ where: { username: username } })
    if (dbUser) {
      const passwordMatch = await bcrypt.compare(password, dbUser.password);
      if (passwordMatch) {
        const token = md5(`${dbUser.username} + ${dbUser.password}`)
        saveToken(dbUser.id, token)
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

const getUserData = async (req, res) => {
  const { id } = req.headers
  try {
    const userData = await userModel.findOne({ where: { id: id } })
    if (userData) {
      res.status(200).send(userData)
    } else {
      res.status(500).send({ message: "Enter valid id" })
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}
const deleteUserData = async (req, res) => {
  const { id } = req.headers
  try {
    const userData = await userModel.destroy({ where: { id } })
    if (userData) {
      res.status(200).send({ message: "user deleted successfully" })
    } else {
      res.status(500).send({ message: "Enter valid id" })
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}
const limitUsersData = async (req, res) => {
  const page = Number(req.params.page)
  const limitValue = Number(req.query.limit) || 10
  try {
    const userData = await userModel.findAndCountAll({ limit: limitValue, offset: (page - 1) * limitValue })
    if (userData.rows.length != 0) {
      res.status(200).send(userData)
    } else {
      res.status(200).send({ message: "oops data not found" })
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}






module.exports = { userRegister, login, getUserData, deleteUserData, limitUsersData }
