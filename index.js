const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000
const User = require("./models/Roles")
const bodyParser = require('body-parser')

const userController = require("./controllers/userController")
User.sync({ force: false });
app.get("/", (req, res) => {
  res.send("Hello world")
})

app.use(bodyParser.json())  // middleware
app.post("/role/add", userController.addRole);
app.get("/role/list", userController.getAllRole)
app.get("/role/list/:id", userController.getSingleRole)
app.get("/role/list/:id", userController.getSingleRole)
app.delete("/role/delete/:id", userController.deleteRole)
app.put("/role/update/:id", userController.updateRole)

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


