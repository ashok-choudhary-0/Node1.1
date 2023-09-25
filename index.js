const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const rolesRouter = require("./router/rolesRouter");
const userRouter = require("./router/userRouter");

const user = require("./models/user")
user.sync({ alter: true })
app.use("/role", rolesRouter)
app.use("/user", userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


