// * Libraries
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Auth, google } from "googleapis";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

let redirectUrl: string | undefined = "test";

router.get("/google", (req: express.Request, res: express.Response) => {
  const auth: Auth.OAuth2Client = new google.auth.OAuth2(
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

router.get(
  "/google/callback",
  async (req: express.Request, res: express.Response) => {
    const auth: Auth.OAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_AUTH_CALLBACK
    );

    const { code } = req.query;
    const { tokens }: any = await auth.getToken(String(code));
    console.log("tokens", tokens);

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
        String(process.env.JWT_SECRET),
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

router.get("/logout", (_req: express.Request, res: express.Response, next) => {
  const domain =
    process.env.ENVIRONMENT == "development" ? undefined : ".while.so";
  try {
    res.clearCookie("authorization", { domain, path: "/" });
    res.redirect(`${process.env.WHILE_APP}/`);
  } catch (err) {
    console.log("errrrrrr", err);
    next(err);
  }
});

export { router as authRoutes };
