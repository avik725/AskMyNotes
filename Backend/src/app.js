import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import NotesRouter from "./routes/notes.routes.js";
import PrivateNotesRouter from "./routes/privateNotes.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

// cors middleware configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// accept json data
app.use(express.json({ limit: "16kb" }));

// accept data in url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// store the static assets
app.use(express.static("public"));

// inject cookieParser middleware
app.use(cookieParser());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/notes", NotesRouter);
app.use("/api/v1/private-notes", PrivateNotesRouter);

app.use((err, req, res, next) => globalErrorHandler(err, req, res, next));

export { app };
