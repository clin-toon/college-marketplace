import { pool } from "../../db/pool";

interface MessageRow {
  message_id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
}

export async function getConversationHistory(
  listingId: string,
  userIdA: string,
  userIdB: string,
) {
  const result = await pool.query<MessageRow>(
    `SELECT message_id, listing_id, sender_id, receiver_id, content, created_at
     FROM messages
     WHERE listing_id = $1
       AND ((sender_id = $2 AND receiver_id = $3) OR (sender_id = $3 AND receiver_id = $2))
     ORDER BY created_at ASC`,
    [listingId, userIdA, userIdB],
  );

  return result.rows;
}

export async function saveMessage(input: {
  listingId: string;
  senderId: string;
  receiverId: string;
  content: string;
}) {
  const result = await pool.query<MessageRow>(
    `INSERT INTO messages (listing_id, sender_id, receiver_id, content)
     VALUES ($1, $2, $3, $4)
     RETURNING message_id, listing_id, sender_id, receiver_id, content, created_at`,
    [input.listingId, input.senderId, input.receiverId, input.content],
  );
  return result.rows[0];
}

interface ConversationRow {
  listing_id: string;
  listing_title: string;
  other_user_id: string;
  other_user_name: string | null;
  other_user_email: string;
  last_message: string;
  last_message_at: Date;
}

export async function getConversationsForUser(userId: string) {
  const result = await pool.query<ConversationRow>(
    // DISTINCT ON (listing_id, other_user.user_id) collapses every message
    // in a thread down to one row — ordering by created_at DESC within each
    // group means that one row is the latest message.
    `SELECT DISTINCT ON (m.listing_id, other_user.user_id)
       m.listing_id,
       l.title AS listing_title,
       other_user.user_id AS other_user_id,
       up.full_name AS other_user_name,
       other_user.email AS other_user_email,
       m.content AS last_message,
       m.created_at AS last_message_at
     FROM messages m
     INNER JOIN listings l ON l.listing_id = m.listing_id
     INNER JOIN users other_user
       ON other_user.user_id = CASE
            WHEN m.sender_id = $1 THEN m.receiver_id
            ELSE m.sender_id
          END
     LEFT JOIN user_profile up ON up.user_id = other_user.user_id
     WHERE m.sender_id = $1 OR m.receiver_id = $1
     ORDER BY m.listing_id, other_user.user_id, m.created_at DESC`,
    [userId],
  );

  const conversations = result.rows.map((row) => ({
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    otherUserId: row.other_user_id,
    otherUserName: row.other_user_name,
    otherUserEmail: row.other_user_email,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
  }));

  // DISTINCT ON forces ordering by its own grouping columns first, so the
  // result isn't sorted by recency yet — do that pass in application code.
  return conversations.sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
}
