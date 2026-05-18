import express from "express";
import routes from "./routes/index.route";
import session from "express-session";
import cors from "cors";
import { env } from "../env";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));
app.use(session({ 
  secret: env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use("/api/v1", routes);

export default app;
