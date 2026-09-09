import express, { Response, Request } from "express";
import { pool } from "./db/pool";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import listingRoutes from "./modules/listing/listing.routes";
import favouriteRoutes from "./modules/favourites/favourites.routes";
import categoryRoutes from "./modules/categories/categories.route";
import messageRoutes from "./modules/message/message.routes";

import cors from "cors";
import http from "http";
import { initSocket } from "./socket";
export const app = express();
const PORT = env.port || 8000;

const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/", messageRoutes);

// centralized error handler
app.use(errorHandler);

// db connection check
pool
  .query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error.message));

httpServer.listen(PORT, () =>
  console.log(`Server running on port ${env.port}`),
);
