import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import * as cookie from "cookie";
import { verifyAccessToken } from "./utils/token";
import jwt from "jsonwebtoken";
import { env } from "./config/env";
import { getChatRoomName } from "./utils/chatRoom";
import { sendMessageSchema } from "./modules/message/message.types";

import { saveMessage } from "./modules/message/message.services";
import { getListingSellerId } from "./modules/listing/listing.services";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function initSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.frontend_url,
      credentials: true,
    },
  });

  // Runs once, before a connection is accepted — this is our "authenticate middleware" for sockets
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;

      if (!rawCookies) return next(new Error("Authentication required"));
      const parsed = cookie.parseCookie(rawCookies);

      const token = parsed.access_token;
      if (!token) return next(new Error("Authentication required"));

      const payload = verifyAccessToken(token);
      socket.userId = payload.userId; // attach verified identity to this socket, same idea as req.user
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new Error("TokenExpired"));
      }
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;

    socket.on(
      "join_conversation",
      async (
        {
          listingId,
          otherUserId,
        }: {
          listingId: string;
          otherUserId: string;
        },
        ack,
      ) => {
        try {
          const sellerId = await getListingSellerId(listingId);
          if (!sellerId) {
            return ack?.({ success: false, error: "Listing not found" });
          }
          const isSeller = userId === sellerId;
          const otherIsSeller = otherUserId === sellerId;

          if (!isSeller && !otherIsSeller) {
            return ack?.({
              success: false,
              error: "You are not part of this conversation",
            });
          }

          const room = getChatRoomName(listingId, userId, otherUserId);

          socket.join(room);
          ack?.({ success: true, room });
        } catch (error) {
          console.error("Failed to join conversation:", error);
          ack?.({ success: false, error: "Could not join conversation" });
        }
      },
    );

    // Client sends a message
    socket.on("send_message", async (payload, ack) => {
      try {
        const data = sendMessageSchema.parse(payload); // throws if invalid — caught below

        const sellerId = await getListingSellerId(data.listingId);
        if (!sellerId) {
          return ack?.({ success: false, error: "Listing not found" });
        }

        const isSeller = userId === sellerId;
        const receiverIsSeller = data.receiverId === sellerId;

        if (!isSeller && !receiverIsSeller) {
          return ack?.({
            success: false,
            error: "You are not part of this conversation",
          });
        }

        const message = await saveMessage({
          listingId: data.listingId,
          senderId: userId,
          receiverId: data.receiverId,
          content: data.content,
        });

        const room = getChatRoomName(data.listingId, userId, data.receiverId);

        io.to(room).emit("receive_message", message);

        ack?.({ success: true, message });
      } catch (err) {
        console.error("Failed to send message:", err);

        ack?.({
          success: false,
          error: "Message failed to send. Please try again.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
}
