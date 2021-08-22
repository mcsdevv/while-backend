// * Libraries
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// * Initialization
const router = express.Router();

let redirectUrl: string | undefined = "test";

router.get(
  "/google",
  function (req: express.Request, _res, next) {
    const redirect = req.query.next;
    redirectUrl = redirect ? String(redirect) : req.headers.referer;

    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.WHILE_APP,
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

    const domain =
      process.env.ENVIRONMENT == "development" ? undefined : ".while.so";

    res.cookie("authorization", token, { domain });

    res.redirect(
      `${redirectUrl?.toString() || process.env.WHILE_APP + "/dashboard"}`
    );
  }
);

router.get("/logout", (req: express.Request, res: express.Response, next) => {
  const domain =
    process.env.ENVIRONMENT == "development" ? undefined : ".while.so";
  try {
    req.logout();
    res.clearCookie("authorization", { domain, path: "/" });
    res.redirect(`${process.env.WHILE_APP}/`);
  } catch (err) {
    next(err);
  }
});

export { router as authRoutes };
