export const IMAGE_BY_ID = `SELECT * FROM image i WHERE i.id = $1`;

export const INSERT_IMAGE = `INSERT INTO image (blob, filename, mime_type)
  VALUES ($1, $2, $3) RETURNING id`;

export const DELETE_IMAGE_BY_ID = `DELETE FROM image i WHERE i.id = $1`;
