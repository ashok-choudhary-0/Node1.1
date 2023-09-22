const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const rolesRouter = require("./router/rolesRouter");
const userRouter = require("./router/userRouter");
const passport = require("passport")
const expressSession = require("express-session")
const { initializingPassport } = require("./middlewares/passportConfig")

initializingPassport(passport)
app.use(expressSession({ secret: process.env.passportSecKey, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

const address = require("./models/address")
address.sync({ alter: false })
app.use("/role", rolesRouter)
app.use("/user", userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


