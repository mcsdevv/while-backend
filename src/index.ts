// * Libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

// * Routes
import { authRoutes } from "../routes/auth";
import { agendaRoutes } from "../routes/api/agendas";
import { meetingRoutes } from "../routes/api/meetings";
import { noteRoutes } from "../routes/api/notes";
import { taskRoutes } from "../routes/api/tasks";
import { userRoutes } from "../routes/api/user";

// * Initialization
const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
  origin: "*",
  maxAge: 86400,
};

// * Sentry
Sentry.init({
  dsn: "https://59cedcb4aef745a084f5df967833c1a6@o969827.ingest.sentry.io/5920959",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

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

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
