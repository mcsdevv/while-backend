// * Libraries
import express = require("express");
import passport = require("passport");

// * Initialization
const router = express.Router();

let redirectUrl: string | undefined = "test";

router.get(
  "/google",
  function (req, res, next) {
    redirectUrl = req.headers.referer;
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
    session: true,
  }),
  (req: express.Request, res: express.Response) => {
    console.log("redirectUrl", redirectUrl);
    // TODO Set logged in cookie
    res.redirect(redirectUrl?.toString() || "/");
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect(`${process.env.WHILE_APP}/`);
});

module.exports = router;
