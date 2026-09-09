import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { conversationHistoryParamSchema } from "./message.types";
import {
  getConversationsHandler,
  getHistoryHandler,
} from "./message.controllers";

const router = Router();

router.use(authenticate);

// static path before ":listingId/:otherUserId", so "conversations" is
// never accidentally swallowed as a listingId param
router.get("/messages/conversations", getConversationsHandler);
router.get(
  "/messages/:listingId/:otherUserId",
  validate({ params: conversationHistoryParamSchema }),
  getHistoryHandler,
);

export default router;
