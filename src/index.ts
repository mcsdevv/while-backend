// * Libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// * Routes
const authRoutes = require("../routes/auth");
const agendaRoutes = require("../routes/api/agendas");
const meetingRoutes = require("../routes/api/meetings");
const noteRoutes = require("../routes/api/notes");
const taskRoutes = require("../routes/api/tasks");
const userRoutes = require("../routes/api/user");

// * Initialization
const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
  allowedHeaders: ["Authorization"],
  maxAge: 86400,
};

// * Middleware
require("./passport")(app);
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// * Application Routes
app.use("/auth", authRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

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
