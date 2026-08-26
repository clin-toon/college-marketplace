import express, { Response, Request } from "express";
import { pool } from "./db/pool";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import listingRoutes from "./modules/listing/listing.routes";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", listingRoutes);

// centralized error handler
app.use(errorHandler);

// db connection check
pool
  .query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error.message));

app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
