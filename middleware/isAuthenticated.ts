import express from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  const tokenStripped = token.substr(7);

  try {
    const jwtVerified: any = jwt.verify(tokenStripped.toString(), "secret");
    req.user = jwtVerified.data;
  } catch (error) {
    console.log("err", error);
    return res.status(401).send(error);
  }

  next();
};
