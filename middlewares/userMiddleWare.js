const validateToken = async (req, res, next) => {
  const { id } = req.headers
  if (id) {
    next();
  } else {
    res.status(500).send({ message: "Please enter id" })
  }
}
module.exports = { validateToken }