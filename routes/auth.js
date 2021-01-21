var express = require("express");
const { check } = require("express-validator");
var router = express.Router();
const { signout, signup } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name should be at least 3 characters").isLength({ min: 3 }),
    check("email", "Enter Valid Email").isEmail(),
    check("password", "Enter Password should be at least 3").isLength({
      min: 3,
    }),
  ],
  signup
);
router.get("/signout", signout);

module.exports = router;
