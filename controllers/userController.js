const User = require("../models/Roles")
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
    const allUsersData = await User.findAll({});
    res.status(200).send(allUsersData)
  } catch (err) {
    res.status(500).send(err);
  }
}
const getSingleUser = async (req, res) => {
  try {
    const singleUserData = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(singleUserData)
  } catch (err) {
    res.status(500).send(err)
  }
}
const deleteUser = async (req, res) => {
  try {
    const deletedUserData = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(deletedUserData)
  } catch (err) {
    res.status(500).send(err)
  }
}
const updateUser = async (req, res) => {
  let { name, description } = req.body;
  try {
    const data = await User.update({ name, description }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send(err)
  }
}
module.exports = { addUser, getAllUsers, getSingleUser, deleteUser, updateUser }