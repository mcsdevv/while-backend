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
    const contacts = await prisma.contact.findMany({
      where: { creatorId: id },
    });
    res.status(200).json(contacts);
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});

module.exports = router;
