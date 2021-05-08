import express from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Missing authorization token.");
  }

  const tokenTrimmed = token.substring(7, token.length);
  if (tokenTrimmed === "undefined") {
    return res.status(401).send("Token malformed.");
  }

  try {
    const jwtVerified: any = jwt.verify(tokenTrimmed, "secret");
    req.user = jwtVerified.data;
  } catch (error) {
    console.log("err", error);
    return res.status(401).send(error);
  }

  next();
};
