// * Libraries
import express from "express";
import cookieSession from "cookie-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

// * Initialization
const prisma = new PrismaClient();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (app: express.Application) => {
  app.use(
    cookieSession({
      name: "session",
      maxAge: 24 * 60 * 60 * 1000,
      keys: ["herp", "derp"],
      secure: false,
    })
  );

  passport.serializeUser((user, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((user, done: any) => {
    done(null, user);
  });

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

  app.use(passport.initialize());
  app.use(passport.session());
};
