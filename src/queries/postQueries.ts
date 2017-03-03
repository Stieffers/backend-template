export const LATEST_POSTS_PAGED = `SELECT p.*, au.username, au.first_name, au.last_name
  FROM post p 
  INNER JOIN app_user au ON au.id = p.created_user_id 
  ORDER BY p.created_timestamp DESC
  LIMIT $1 OFFSET $2`;

export const INSERT_POST = `INSERT INTO post (title, body, created_user_id, updated_user_id)
  VALUES ($1, $2, $3, $3) RETURNING id`;

export const POST_BY_ID = `SELECT p.* FROM post p WHERE p.id = $1`;

export const DELETE_POST_BY_ID = `DELETE FROM post p WHERE p.id = $1`;
