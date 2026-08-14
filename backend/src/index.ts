import express, { Response, Request } from "express";
import { pool } from "./db/pool";
import { env } from "./config/env";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hi");
});

// db connection check
pool
  .query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error.message));

app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
