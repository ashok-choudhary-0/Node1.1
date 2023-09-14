const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController")

router.post("/add", rolesController.addRole);
router.get("/list", rolesController.getAllRole)
router.get("/list/:id", rolesController.getSingleRole)
router.delete("/delete/:id", rolesController.deleteRole)
router.put("/update/:id", rolesController.updateRole)

module.exports = router
