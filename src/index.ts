// * Libraries
import express from "express";
import cors from "cors";
// import { PrismaClient } from "@prisma/client";

// * Routes
const authRoutes = require("../routes/auth");

// * Initialization
const app = express();
const port = process.env.PORT || 3001;
// const prisma = new PrismaClient();

// * Middleware
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(cors());
// app.all("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });
require("./passport")(app);

// * Application Routes
app.use("/auth", authRoutes);

// app.get("/", async (req, res) => {
//   const user = await prisma.user.findUnique({
//     where: { id: 1 },
//   });
//   res.json({ Hello: user });
// });

app.get("/", (req, res) => {
  res.send("I'm alive!");
});

app.get("/cookies", (req, res) => {
  console.log("cookies", req.cookies);
  res.cookie("herp", "derp", { domain: ".while.so" });
  res.json(req.cookies);
});

app.get("/derps", async (req, res) => {
  console.log("auth", req.isAuthenticated());
  console.log("host", req.headers.host);
  console.log("url", req.url);
  console.log(req.user);
  res.json({ Hello: "derps" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
