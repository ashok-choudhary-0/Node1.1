const addUser = async (req, res) => {
  try {
    let { name, description } = req.body;
    const newUser = await User.create({ name, description });
    res.status(200).send(newUser)
  } catch (err) {
    res.status(500).send(err);
  }
}
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({});
    res.status(200).send(allUsers)
  } catch (err) {
    res.status(500).send(err);
  }
}
const getSingleUser = async (req, res) => {
  try {
    const singleUser = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(singleUser)
  } catch (err) {
    res.status(500).send(err)
  }
}
const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(deleteUser)
  } catch (err) {
    res.status(500).send(err)
  }
}
const updateUser = async (req, res) => {
  let { name, description } = req.body;
  try {
    const updateUser = await User.update({ name, description }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(updateUser)
  } catch (err) {
    res.status(500).send(err)
  }
}
module.exports = { addUser, getAllUsers, getSingleUser, deleteUser, updateUser }