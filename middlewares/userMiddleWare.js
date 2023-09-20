const accessTokenModel = require("../models/access_token");

// const validateToken = async (req, res, next) => {
//   const { id } = req.headers
//   if (id) {
//     next();
//   } else {
//     res.status(500).send({ message: "Please enter id" })
//   }
// }

const validateToken = async (req, res, next) => {
  const { token } = req.headers
  const userData = await accessTokenModel.findOne({ where: { access_token: token } })
  const expiryTime = userData.expiry
  const currentTime = new Date();
  if (currentTime < expiryTime) {
    next();
  } else {
    res.status(500).send({ message: "invalid token" })
  }
}

module.exports = { validateToken }