const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/userController")
const { validateToken } = require("../middlewares/userMiddleWare")
const passport = require('passport');

userRouter.post("/register", userController.userRegister)
userRouter.post("/login", passport.authenticate('local', { failureMessage: true }), userController.login)
userRouter.get("/get", validateToken, userController.getUserData)
userRouter.delete("/delete", validateToken, userController.deleteUserData)
userRouter.get("/list/:page", userController.limitUsersData)
userRouter.post("/address", validateToken, userController.userAddress)

module.exports = userRouter;