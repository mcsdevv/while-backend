import bodyParser from "body-parser";
import express from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  // console.time("db");
  // const user = await prisma.user.findUnique({
  //   where: { id: 1 },
  // });
  // console.timeEnd("db");
  res.json({ Hello: process.env.DATABASE_URL });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
