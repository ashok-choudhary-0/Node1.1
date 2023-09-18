const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/userController")

userRouter.post("/register", userController.userRegister)
userRouter.post("/login", userController.login)
module.exports = userRouter;