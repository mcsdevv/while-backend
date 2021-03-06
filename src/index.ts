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
  allowedHeaders: [
    "Accept",
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Max-Age",
  ],
  credentials: true,
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
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(Sentry.Handlers.tracingHandler());

// * Middleware
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

// * Healthcheck Route
app.get("/", (req, res) => {
  console.log("I'm alive!");
  res.send("I'm alive!");
});

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

process.on("uncaughtException", function (err: Error) {
  try {
    console.log(err);
    Sentry.captureException(err);
  } catch (err) {
    Sentry.captureException(err);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}.`);
});
