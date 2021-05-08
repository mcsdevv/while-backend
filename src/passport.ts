// * Libraries
import express from "express";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

// * Initialization
const prisma = new PrismaClient();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (app: express.Application) => {
  passport.serializeUser((user, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((user, done: any) => {
    done(null, user);
  });

  //   const opts = {
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: 'secret',

  //   }

  //   passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //     console.log("JWT BASED AUTH GETTING CALLED") // called everytime a protected URL is being served
  //     if (CheckUser(jwt_payload.data)) {
  //         return done(null, jwt_payload.data)
  //     } else {
  //         // user account doesnt exists in the DATA
  //         return done(null, false)
  //     }
  // }))

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
};
