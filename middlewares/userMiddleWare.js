const { checkTokenExpired } = require("../controllers/userController")
// const validateToken = async (req, res, next) => {
//   const { id } = req.headers
//   if (id) {
//     next();
//   } else {
//     res.status(500).send({ message: "Please enter id" })
//   }
// }

const validateToken = async (req, res, next) => {
  if (!checkTokenExpired()) {
    next();
  } else {
    res.status(500).send({ message: "invalid token" })
  }
}
module.exports = { validateToken }