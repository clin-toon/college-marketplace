import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/chat";

interface JoinAck {
  success: boolean;
  room?: string;
  error?: string;
}

interface SendAck {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}

export function useChatSocket(
  listingId: string,
  otherUserId: string,
  onMessage: (message: ChatMessage) => void,
) {
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const socket = connectSocket();
    setIsJoined(false);

    function join() {
      socket.emit(
        "join_conversation",
        { listingId, otherUserId },
        (ack: JoinAck) => {
          if (ack?.success) {
            setIsJoined(true);
          } else {
            toast.error(ack?.error ?? "Couldn't join this conversation.");
          }
        },
      );
    }

    // looker
    function handleConnect() {
      console.log("Connected to socket server. ");
      setIsConnected(true);
      join();
    }
    function handleDisconnect() {
      console.log("Disconnected to socket server. ");
      setIsConnected(false);
      setIsJoined(false);
    }
    function handleMessage(message: ChatMessage) {
      // console.log("[LIVE]", JSON.stringify(message));
      onMessageRef.current(message);
    }

    // temporary debugging — remove later
    socket.onAny((event, ...args) => console.log("[socket]", event, args));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleMessage);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleMessage);
      socket.offAny();
      disconnectSocket();
    };
  }, [listingId, otherUserId]);

  const sendMessage = useCallback(
    (content: string) => {
      const socket = connectSocket();
      if (!socket.connected) {
        toast.error("Connection lost. Reconnecting…");
        socket.connect();
        return;
      }

      socket.emit(
        "send_message",
        {
          listingId,
          receiverId: otherUserId,
          content,
          clientId: crypto.randomUUID(), // idempotency key — server dedupes on this
        },
        (ack: SendAck) => {
          if (ack?.success && ack.message) {
            onMessageRef.current(ack.message);
          } else {
            toast.error(
              ack?.error ?? "Message failed to send. Please try again.",
            );
          }
        },
      );
    },
    [listingId, otherUserId],
  );

  return { isConnected, isJoined, sendMessage };
}
