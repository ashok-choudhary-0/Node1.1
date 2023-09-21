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
  if (!token) {
    res.status(404).send({ message: "token not found" })
    return;
  }
  const userData = await accessTokenModel.findOne({ where: { access_token: token } })
  if (userData) {
    const expiryTime = userData.expiry
    const currentTime = new Date();
    if (currentTime < expiryTime) {
      next();
    } else {
      res.status(500).send({ message: "invalid token" })
    }
  } else {
    res.status(500).send({ message: "token not match any user to database" })
  }
}

module.exports = { validateToken }