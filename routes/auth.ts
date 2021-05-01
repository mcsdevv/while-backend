// * Libraries
import express = require("express");
import passport = require("passport");

// * Initialization
const router = express.Router();

let derps: string | undefined = "test";

router.get(
  "/google",
  function (req, res, next) {
    console.log("derps1", derps);
    console.log("referrer", req.headers);
    derps = req.headers.referer;
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/test",
  }),
  (req: express.Request, res: express.Response) => {
    console.log("derps2", derps);
    res.redirect(`${process.env.WHILE_APP}/`);
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect(`${process.env.WHILE_APP}/`);
});

module.exports = router;
