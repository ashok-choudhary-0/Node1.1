const User = require("../models/Roles")
const addUser = async (req, res) => {
  try {
    let data = req.body;
    const newUser = await User.create(data);
    res.status(200).json({ data: newUser })
  } catch (err) {
    res.status(500).json(err);
  }
}
const getAllUsers = async (req, res) => {
  try {
    const data = await User.findAll({});
    res.status(200).json({ data: data })
  } catch (err) {
    res.status(500).json(err);
  }
}
const getSingleUser = async (req, res) => {
  try {
    const data = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ data: data })
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteUser = async (req, res) => {
  try {
    const data = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ data: data })
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateUser = async (req, res) => {
  const updatedData = req.body
  try {
    const data = await User.update(updatedData, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ data: data })
  } catch (err) {
    res.status(500).json(err);
  }
}
module.exports = { addUser, getAllUsers, getSingleUser, deleteUser, updateUser }