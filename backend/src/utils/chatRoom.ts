export function getChatRoomName(
  listingId: string,
  userIdA: string,
  userIdB: string,
): string {
  const [first, second] = [userIdA, userIdB].sort();
  return `chat:${listingId}:${first}:${second}`;
}
