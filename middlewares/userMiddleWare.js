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

  const tokenData = await accessTokenModel.findOne({ where: { access_token: token } })
  if (tokenData) {
    const expiryTime = tokenData.expiry
    const currentTime = new Date();
    if (currentTime < expiryTime) {
      req.body = { ...req.body, user_id: tokenData.user_id }
      next();
    } else {
      res.status(401).send({ message: "invalid token" })
    }
  } else {
    res.status(401).send({ message: "token not match any user to database" })
  }
}

module.exports = { validateToken }