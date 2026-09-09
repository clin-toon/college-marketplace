import { pool } from "../../db/pool";

export const getCategories = async () => {
  const query = "Select * from categories";
  const result = await pool.query(query);
  return result.rows;
};
