import { z } from "zod";

export const favouriteParamSchema = z.object({
  listingId: z.string().uuid("Invalid listing id"),
});

export type FavouriteParam = z.infer<typeof favouriteParamSchema>;
