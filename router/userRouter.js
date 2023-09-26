const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/userController")
const { validateToken } = require("../middlewares/userMiddleWare")
const { uploads, firebaseUpload } = require("../controllers/fileUpload")

userRouter.post("/register", userController.userRegister)
// userRouter.post("/login", loginAuthentication, userController.login)
userRouter.post("/login", userController.login)
userRouter.get("/get", validateToken, userController.getUserData)
userRouter.delete("/delete", validateToken, userController.deleteUserData)
userRouter.get("/list/:page", userController.limitUsersData)
userRouter.post("/address", validateToken, userController.userAddress)
userRouter.delete("/address", validateToken, userController.deleteUserAddresses)
userRouter.post("/forgot-password", userController.forgotPassword)
userRouter.post("/verify-reset-password/:passwordResetToken", userController.verifyResetPasswordToken)
userRouter.post("/profile-image", validateToken, uploads.single('image'), userController.addUserProfileImage)
userRouter.post("/profile-image-firebase", validateToken, firebaseUpload.single('image'), userController.saveUserImageToFirebase)

module.exports = userRouter;