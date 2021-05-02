// * Libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// * Routes
const authRoutes = require("../routes/auth");

// * Initialization
const app = express();
const port = process.env.PORT || 3001;

// * Middleware
require("./passport")(app);
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(cookieParser());
app.use(cors());

// * Application Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("I'm alive!");
});

app.get("/cookies", (req, res) => {
  console.log("cookies", cookieParser.JSONCookies(req.cookies));
  res.cookie("herp", "derp", { domain: ".while.so" });
  res.json(req.cookies);
});

app.get("/derps", async (req, res) => {
  console.log("auth", req.isAuthenticated());
  console.log("session", req.session);
  console.log("host", req.headers.host);
  console.log("url", req.url);
  console.log(req.user);
  res.json({ Hello: "derps" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
