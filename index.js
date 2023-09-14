const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const userRouter = require("./router/userRouter")


app.use(bodyParser.json())
app.use("/role", userRouter)
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


