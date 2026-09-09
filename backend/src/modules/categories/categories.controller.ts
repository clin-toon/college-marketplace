import { Response, Request } from "express";
import { getCategories } from "./categories.services";

export const categoryHandler = async (req: Request, res: Response) => {
  const cat = await getCategories();
  res.json({
    success: true,
    data: cat,
  });
};
