const validateToken = async (req, res, next) => {
  const token = req.headers.token
  if (token) {
    next();
  } else {
    res.status(500).send({ message: "token not found" })
  }
}
module.exports = { validateToken }