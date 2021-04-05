// * Libraries
import express from "express";
import cookieSession from "cookie-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
var GoogleStrategy = require("passport-google-oauth20").Strategy;

// * Initialization
const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// * Middleware
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["herp", "derp"],
    secure: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// * Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
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

passport.serializeUser((user, done: any) => {
  done(null, user);
});

passport.deserializeUser((user, done: any) => {
  done(null, user);
});

// * Authentication
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
    console.log("req", req.hostname, req.url);
    res.redirect("/derps");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

// * Routes
app.get("/", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
  });
  res.json({ Hello: user });
});

app.get("/derps", async (req, res) => {
  console.log("auth", req.isAuthenticated());
  console.log("host", req.headers.host);
  console.log("url", req.url);
  console.log(req.user);
  res.json({ Hello: "derps" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
