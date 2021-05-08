// * Libraries
import express from "express";
import { PrismaClient } from "@prisma/client";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
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
