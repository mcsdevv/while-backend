// * Libraries
import express from "express";
import { PrismaClient } from "@prisma/client";

// * Middleware
import { isAuthenticated } from "../../middleware/isAuthenticated";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

router.get("/:id", isAuthenticated, async (req: any, res: express.Response) => {
  try {
    const { id } = req.params?.id;
    const notes = await prisma.note.findMany({
      where: { meetingId: id },
    });
    res.status(200).json(notes);
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});

export { router as noteRoutes };
