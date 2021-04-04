import bodyParser from "body-parser";
import express from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const cookieSession = require("cookie-session");

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  // console.time("db");
  const user = await prisma.user.findUnique({
    where: { id: 1 },
  });
  // console.timeEnd("db");
  res.json({ Hello: user });
});

var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["herp", "derp"],
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "350681615246-rmhikqfg66k52vkvfoi2m4qgtu7bfd6p.apps.googleusercontent.com",
      clientSecret: "Va0mrZfJBDCr3SY_b1cO23a8",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: 1 },
        });
        return done(null, user);
      } catch (err) {
        console.log("err", err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/test",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

app.get("/derps", async (req: any, res) => {
  console.log("auth", req.isAuthenticated());
  console.log(req.user);
  res.json({ Hello: "derps" });
});

app.get("/auth/logout", (req: any, res) => {
  req.logout();
  res.send(req.user);
});

app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`);
});
