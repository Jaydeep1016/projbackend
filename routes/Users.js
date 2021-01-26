const express = require("express");
const getAllUsers = require("../controllers/Users");
const router = express.Router();

router.get("/users", getAllUsers);

module.exports = router;
