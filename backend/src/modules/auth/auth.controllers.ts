import { Request, RequestHandler, Response } from "express";
import { AppError } from "../../utils/AppError";

export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  res.send(req.body);
};
