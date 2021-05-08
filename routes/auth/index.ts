// * Libraries
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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
    session: false,
  }),
  (req: express.Request, res: express.Response) => {
    console.log("user", req.user);
    const token = jwt.sign(
      {
        data: req.user,
      },
      "secret",
      { expiresIn: 60 }
    );
    res.cookie("loggedIn", "1", {
      domain: process.env.WHILE_APP,
      expires: new Date(24 * 60 * 60 * 1000),
      secure: true,
      sameSite: false,
    });
    res.redirect(`${redirectUrl?.toString()}?jwt=${token}` || `?jwt=${token}`);
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect(`${process.env.WHILE_APP}/`);
});

module.exports = router;
