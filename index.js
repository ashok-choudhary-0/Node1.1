const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000
const User = require("./models/Roles")
const bodyParser = require('body-parser')
const router = require("./Router/userRouter")
User.sync({ force: false });

app.use(bodyParser.json())
app.use("/role", router)
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


