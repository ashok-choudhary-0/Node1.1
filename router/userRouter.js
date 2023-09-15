const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/userController")

userRouter.post("/register", userController.userRegister)
module.exports = userRouter;