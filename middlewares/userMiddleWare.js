const validateToken = async (req, res, next) => {
  const id = req.headers.id
  if (id) {
    next();
  } else {
    res.status(500).send({ message: "please enter id" })
  }
}
module.exports = { validateToken }