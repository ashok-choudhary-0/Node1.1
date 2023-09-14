const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

router.post("/add", userController.addUser);
router.get("/list", userController.getAllUsers)
router.get("/list/:id", userController.getSingleUser)
router.delete("/delete/:id", userController.deleteUser)
router.put("/update/:id", userController.updateUser)

module.exports = router
