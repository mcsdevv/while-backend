// * Libraries
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

let redirectUrl: string | undefined = "test";

router.get("/google", (req: express.Request, res: express.Response) => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_AUTH_CALLBACK
  );

  const redirect = req.query.next;
  redirectUrl = redirect ? String(redirect) : req.headers.referer;

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
});

// router.get(
//   "/google",
//   function (req: express.Request, _res, next) {
//     const redirect = req.query.next;
//     redirectUrl = redirect ? String(redirect) : req.headers.referer;

//     next();
//   },
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );

router.get(
  "/google/callback",
  async (req: express.Request, res: express.Response) => {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_AUTH_CALLBACK
    );

    const { code } = req.query;
    const { tokens }: any = await auth.getToken(String(code));

    const userDetails: any = jwt.decode(tokens.id_token);

    try {
      const user = await prisma.user.upsert({
        where: { id: userDetails.sub },
        update: { id: userDetails.sub },
        create: {
          id: userDetails.sub,
          email: userDetails.email,
          name: userDetails.name,
          picture: userDetails.picture,
        },
      });
      console.log("user", user);
      const token = jwt.sign(
        {
          data: user,
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
    } catch (e) {
      console.log("error creating user", e);
    }
  }
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: process.env.WHILE_APP,
//     session: false,
//   }),
//   (req: express.Request, res: express.Response) => {
//     console.log("user", req.user);
//     const token = jwt.sign(
//       {
//         data: req.user,
//       },
//       "secret",
//       { expiresIn: "30d" }
//     );

//     console.log("minor");

//     const domain =
//       process.env.ENVIRONMENT == "development" ? undefined : ".while.so";

//     res.cookie("authorization", token, { domain });

//     res.redirect(
//       `${redirectUrl?.toString() || process.env.WHILE_APP + "/dashboard"}`
//     );
//   }
// );

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
