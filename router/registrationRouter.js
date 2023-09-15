const express = require("express")
const registrationRouter = express.Router();
const registrationController = require("../controllers/registrationController")

registrationRouter.post("/register", registrationController.registration)
module.exports = registrationRouter;