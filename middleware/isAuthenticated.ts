import express from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  try {
    const jwtVerified: any = jwt.verify(token.toString(), "secret");
    req.user = jwtVerified.data;
  } catch (error) {
    console.log("err", error);
    throw new Error(error);
    // return res.status(401).send(error);
  }

  next();
};
