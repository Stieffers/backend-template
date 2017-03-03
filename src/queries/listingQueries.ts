export const LATEST_LISTINGS_PAGED = `SELECT l.*, au.username, au.first_name, au.last_name
  FROM listing l 
  INNER JOIN app_user au ON au.id = l.created_user_id 
  ORDER BY l.created_timestamp DESC
  LIMIT $1 OFFSET $2`;

