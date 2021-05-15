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
      { expiresIn: "30d" }
    );
    res.redirect(
      `${
        process.env.WHILE_APP
      }/redirect?next=${redirectUrl?.toString()}&jwt=${token}` ||
        `?jwt=${token}`
    );
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect(`${process.env.WHILE_APP}/`);
});

module.exports = router;