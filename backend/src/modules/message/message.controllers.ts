import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { ConversationHistoryParam } from "./message.types";
import {
  getConversationsForUser,
  getConversationHistory,
} from "./message.services";

// GET /messages/conversations — every thread the current user is part of
export async function getConversationsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const conversations = await getConversationsForUser(req.user.userId);

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
}

// GET /messages/:listingId/:otherUserId — full history for one thread
export async function getHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const { listingId, otherUserId } =
      req.params as unknown as ConversationHistoryParam;

    const messages = await getConversationHistory(
      listingId,
      req.user.userId,
      otherUserId,
    );

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}
