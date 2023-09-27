const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const { getRole } = require("../controllers/rolesController")
const md5 = require('md5');
const accessTokenModel = require("../models/access_token");
const addressModel = require("../models/address");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { getStorage, getDownloadURL } = require("firebase/storage");
const firebase = require("firebase/storage");
const nodemailer = require("nodemailer");



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
const deleteUserAddresses = async (req, res) => {
  const { userAddresses, user_id } = req.body
  try {
    if (userAddresses.length === 0) {
      res.status(404).send({ message: "please provide addressIds to delete the addresses" })
    } else {
      const deletedAddresses = await addressModel.destroy({ where: { user_id, id: { [Op.or]: userAddresses } } })
      if (deletedAddresses > 0) {
        res.status(200).send({ message: "addresses deleted successfully" })
      } else {
        res.status(200).send({ message: "no address deleted please provide correct addressIds or user_id" })
      }
    }
  } catch (err) {
    res.status(500).send({ message: err })
  }
}

const forgotPassword = async (req, res) => {
  const { username } = req.body
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodemailerEmail,
      pass: process.env.nodemailerEmailPassword
    }
  })
  try {
    const userData = await userModel.findOne({ where: { username } })
    if (userData) {
      const passwordResetToken = jwt.sign({
        data: `${userData.username} ${userData.password}`
      }, process.env.jwtSecKey, { expiresIn: 60 * 10 });
      await userModel.update({ passwordResetToken: passwordResetToken }, { where: { username } })

      const info = {
        from: '"ashok.kumar@innotechteam.in',
        to: "ashok03012000@gmail.com",
        subject: "conformation for password reset",
        html: `<b>Password reset url:->  http://localhost:8000/user/forgot-password/${passwordResetToken}</b>`,
      }
      transporter.sendMail(info, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).send({ message: "mail sent successfully", info })
        }
      })
    } else {
      res.status(404).send({ message: "user not found, please check the username" })
    }

  } catch (err) { res.status(500).send(err) }
}
const verifyResetPasswordToken = async (req, res) => {
  const resetToken = req.params.passwordResetToken
  const { new_password } = req.body
  if (!new_password) {
    res.status(404).send({ message: "new password will not be empty" })
  }
  try {
    const verifyToken = jwt.verify(resetToken, process.env.jwtSecKey)

    if (verifyToken) {
      const hashedPassword = bcrypt.hashSync(new_password, 10);
      const updatedUserData = await userModel.update({ password: hashedPassword, passwordResetToken: "" }, { where: { passwordResetToken: resetToken } })
      res.status(200).send({ message: "user password updated successfully", updatedUserData })
    } else {
      res.status(200).send({ message: "user password reset token expired" })
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
const addUserProfileImage = async (req, res) => {
  const { token } = req.headers
  try {
    const accessTokenData = await accessTokenModel.findOne({ where: { access_token: token } })
    await userModel.findOne({ where: { id: accessTokenData.user_id } })
    await userModel.update({ profileImage: req.file.path }, { where: { id: accessTokenData.user_id } })
    res.status(200).send({ message: "file uploaded successfully", filePath: req.file.path })
  } catch (err) {
    res.status(500).send(err)
  }
}

const saveUserImageToFirebase = async (req, res) => {
  const file = req.file;
  const storage = getStorage();
  const fileName = Date.now() + '-' + file.originalname
  try {
    const imageRef = firebase.ref(storage, `/files/${fileName}`)
    await firebase.uploadBytesResumable(imageRef, req.file.buffer)
    const downloadURL = await getDownloadURL(imageRef);
    res.status(200).send({ message: "file uploaded successfully", downloadURL })
  } catch (err) {
    res.status(500).send(err)
  }
}



module.exports = { userRegister, login, getUserData, deleteUserData, limitUsersData, userAddress, deleteUserAddresses, forgotPassword, verifyResetPasswordToken, addUserProfileImage, saveUserImageToFirebase }
