const User = require("../models/Roles")


const addRole = async (req, res) => {

  try {
    let data = req.body;
    console.log(data)
    const newUser = await User.create(data);

    res.status(200).json({ data: newUser })
  } catch (err) {
    res.status(500).json(err);
  }


}

const getAllRole = async (req, res) => {
  try {
    const data = await User.findAll({});
    res.status(200).json({ data: data })
  } catch (err) {
    res.status(500).json(err);
  }
}

const getSingleRole = async (req, res) => {
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

const deleteRole = async (req, res) => {
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
const updateRole = async (req, res) => {
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


module.exports = { addRole, getAllRole, getSingleRole, deleteRole, updateRole }