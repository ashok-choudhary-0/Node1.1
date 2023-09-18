const Roles = require("../models/roles")
const addRole = async (req, res) => {
  try {
    let { name, description } = req.body;
    const newRole = await Roles.create({ name, description });
    res.status(200).send(newRole)
  } catch (err) {
    res.status(500).send(err);
  }
}
const getAllRole = async (req, res) => {
  try {
    const allRoles = await Roles.findAll({});
    res.status(200).send(allRoles)
  } catch (err) {
    res.status(500).send(err);
  }
}
const getRole = async (id) => {
  return await Roles.findOne({
    where: {
      id: id
    }
  });
}
const getSingleRole = async (req, res) => {
  try {
    const singleRole = await getRole(req.params.id)
    res.status(200).send(singleRole)
  } catch (err) {
    res.status(500).send(err)
  }
}
const deleteRole = async (req, res) => {
  try {
    const deleteRole = await Roles.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(deleteRole)
  } catch (err) {
    res.status(500).send(err)
  }
}
const updateRole = async (req, res) => {
  let { name, description } = req.body;
  try {
    const updateRole = await Roles.update({ name, description }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(updateRole)
  } catch (err) {
    res.status(500).send(err)
  }
}
module.exports = { addRole, getAllRole, getSingleRole, deleteRole, updateRole, getRole }