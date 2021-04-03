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
  const user = await prisma.user.findMany();
  // console.timeEnd("db");
  res.json({ Hello: user });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
