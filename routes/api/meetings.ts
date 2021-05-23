// * Libraries
import express from "express";
import { Meeting, PrismaClient } from "@prisma/client";

// * Middleware
import { isAuthenticated } from "../../middleware/isAuthenticated";

// * Initialization
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", isAuthenticated, async (req: any, res: express.Response) => {
  try {
    const { id } = req.user;
    const meetings: Meeting[] = await prisma.meeting.findMany({
      where: { creatorId: id },
    });
    res.status(200).json(meetings);
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});

router.post(
  "/create",
  isAuthenticated,
  async (req: any, res: express.Response) => {
    try {
      const { id } = req.user;
      const meeting = await prisma.meeting.create({ data: { creatorId: id } });
      res.status(200).json(meeting);
    } catch (err) {
      console.log("err", err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
