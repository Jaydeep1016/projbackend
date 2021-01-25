var express = require("express");
const { check } = require("express-validator");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

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

router.post(
  "/signin",
  [
    check("email", "Enter Valid Email").isEmail(),
    check("password", "Enter Password should be at least 3").isLength({
      min: 3,
    }),
  ],
  signin
);
router.get("/signout", signout);

// router.get("/testRoute", isSignedIn, (req, res) => {
//   return res.json(req.auth);
// });

module.exports = router;
