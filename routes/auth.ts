// * Libraries
import express = require("express");
import passport = require("passport");

// * Initialization
const router = express.Router();

router.get(
  "/google",
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
    console.log("req", req.hostname, req.url, req.headers);
    res.redirect(`${process.env.WHILE_APP}/`);
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.send(req.user);
});

module.exports = router;
