import express, { Response, Request } from "express";
import { pool } from "./db/pool";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import listingRoutes from "./modules/listing/listing.routes";
import favouriteRoutes from "./modules/favourites/favourites.routes";
import cors from "cors";
const app = express();
const PORT = env.port || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1", favouriteRoutes);

// centralized error handler
app.use(errorHandler);

// db connection check
pool
  .query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error.message));

app.listen(PORT, () => console.log(`Server running on port ${env.port}`));
