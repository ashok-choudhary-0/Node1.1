const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

router.post("/role/add", userController.addUser);
router.get("/role/list", userController.getAllUsers)
router.get("/role/list/:id", userController.getSingleUser)
router.delete("/role/delete/:id", userController.deleteUser)
router.put("/role/update/:id", userController.updateUser)

module.exports = router
