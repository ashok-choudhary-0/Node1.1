const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const { getRole } = require("../controllers/rolesController")
const md5 = require('md5');
const accessTokenModel = require("../models/access_token");
const addressModel = require("../models/address");
const { Op } = require("sequelize");
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
  let currentTime = new Date()
  let expiry = new Date(currentTime);
  expiry = expiry.setHours(currentTime.getHours() + 1)
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
        res.status(200).send({ dbUser, token })
      } else {
        res.status(401).send({ message: "incorrect password please try again" })
      }
    } else {
      res.status(401).send({ message: "user not found" })
    }

  } catch (err) {
    res.status(500).send(err)
  }

}

// const login = (req,res)=>{
//   res.status(200).send({message:"login successfully"})
// }
// const getUserData = async (req, res) => {
//   const { id } = req.headers
//   try {
//     const userData = await userModel.findOne({ where: { id: id } })
//     if (userData) {
//       res.status(200).send(userData)
//     } else {
//       res.status(500).send({ message: "Enter valid id" })
//     }
//   } catch (err) {
//     res.status(500).send({ message: err })
//   }
// }
const getUserData = async (req, res) => {
  const { user_id } = req.body
  try {
    const userData = await userModel.findOne({
      where: { id: user_id },
      include: [{ model: addressModel, where: { user_id }, required: false }],
    })
    res.status(200).send(userData)

  } catch (err) {
    res.status(500).send({ message: err.message })
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
const userAddress = async (req, res) => {
  const { address, city, state, pin_code, phone_no, user_id } = req.body
  try {
    if (!address || !city || !state || !pin_code || !phone_no) {
      res.status(400).send({ message: "please fill the required fields" })
    } else {
      const userAddress = await addressModel.create({ user_id, address, city, state, pin_code, phone_no })
      res.status(200).send(userAddress)
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}
const deleteUsersAddresses = async (req, res) => {
  const { addressArray } = req.body
  try {
    if (addressArray.length == 0) {
      res.status(404).send({ message: "please provide userIds to delete the addresses" })
    } else {
      const countAddress = await addressModel.count({
        where: {
          user_id: {
            [Op.in]: addressArray
          }
        }
      });
      const deletedAddresses = await addressModel.destroy({ where: { user_id: addressArray } })
      if (deletedAddresses > 0) {
        let addressDeletedMessage;
        if (countAddress != addressArray.length) {
          addressDeletedMessage = "some user ids not present in the database rest userId addresses deleted successfully"
        } else {
          addressDeletedMessage = "userId addresses deleted successfully"
        }
        res.status(200).send({ message: `${addressDeletedMessage}` })
      } else {
        res.status(200).send({ message: "no address deleted please provide correct userIds" })
      }
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}
module.exports = { userRegister, login, getUserData, deleteUserData, limitUsersData, userAddress, deleteUsersAddresses }
