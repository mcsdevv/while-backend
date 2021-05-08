// * Libraries
import express from "express";
import { PrismaClient } from "@prisma/client";

// * Middleware
import { isAuthenticated } from "../../middleware/isAuthenticated";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  console.log("user", req.user);
  try {
    const user = await prisma.user.findUnique({
      where: { id: "1" },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});

module.exports = router;
