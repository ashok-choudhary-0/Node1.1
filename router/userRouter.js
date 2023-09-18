const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/userController")
const { validateToken } = require("../middlewares/userMiddleWare")

userRouter.post("/register", userController.userRegister)
userRouter.post("/login", userController.login)
userRouter.get("/get", validateToken, userController.getUserData)

module.exports = userRouter;