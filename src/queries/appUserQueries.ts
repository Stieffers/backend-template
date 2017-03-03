export const USER_BY_ID =
  `SELECT au.* 
  FROM app_user au 
  WHERE au.id = $1`;

export const USER_BY_USERNAME =
  `SELECT au.* 
  FROM app_user au 
  WHERE au.username = lower($1)`;

export const ROLES_BY_USER_ID =
  `SELECT r.role 
  FROM user_role ur 
  INNER JOIN role r ON ur.role_id = r.id 
  WHERE ur.user_id = $1`;

export const INSERT_USER =
  `INSERT INTO app_user 
  (id, username, password)
  VALUES
  (DEFAULT, lower($1), $2) RETURNING id`;

export const ACTIVATE_USER_BY_ID =
  `UPDATE app_user
  SET activated = true
  WHERE id = $1`;

export const INSERT_USER_ROLE =
  `INSERT INTO user_role (user_id, role_id)
  VALUES ($1, $2)`;

export const UPDATE_USER_BY_USERNAME =
  `UPDATE app_user
  SET first_name = $2,
  last_name = $3,
  biography = $4,
  profile_image_id = $5
  WHERE username = lower($1)
  RETURNING id`;

export const UPDATE_PROFILE_IMAGE_BY_USERNAME =
  `UPDATE app_user
  SET profile_image_id = $1
  WHERE username = lower($2)
  RETURNING id`;
