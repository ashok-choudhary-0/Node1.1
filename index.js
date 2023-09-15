const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const rolesRouter = require("./router/rolesRouter");
const registrationRouter = require("./router/registrationRouter")

app.use("/role", rolesRouter)
app.use("/user", registrationRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


