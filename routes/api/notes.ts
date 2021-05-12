// * Libraries
import express from "express";
import { PrismaClient } from "@prisma/client";

// * Middleware
import { isAuthenticated } from "../../middleware/isAuthenticated";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", isAuthenticated, async (req: any, res: express.Response) => {
  try {
    const { id } = req.user;
    const notes = await prisma.note.findMany({
      where: { creatorId: id },
    });
    res.status(200).json(notes);
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});

module.exports = router;
