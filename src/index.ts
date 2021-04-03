import bodyParser from "body-parser";
import express from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  // console.time("db");
  const user = await prisma.user.findUnique({
    where: { id: 1 },
  });
  // console.timeEnd("db");
  res.json({ Hello: user });
});

app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`);
});
