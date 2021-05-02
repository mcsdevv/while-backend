// * Libraries
import express from "express";
import expressSession from "express-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

// * Initialization
const prisma = new PrismaClient();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (app: express.Application) => {
  app.use(
    expressSession({
      name: "session",
      secret: "derps",
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
      // domain: ".while.so",
      // keys: ["herp", "derp"],
      // secure: true,
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
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: passport.Profile,
        done: any
      ) => {
        try {
          const user = await prisma.user.upsert({
            where: { id: profile.id },
            update: { id: profile.id },
            create: {
              id: profile.id,
              email: profile.emails ? profile.emails[0].value : "",
              name: profile.displayName,
              picture: profile.photos ? profile.photos[0].value : "",
            },
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
