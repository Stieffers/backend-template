export interface Listing {
  id: number,
  title: string,
  slug: string,
  body: string,
  price: number,
  thumbnail_image_id: number,
  created_timestamp: Date,
  created_user_id: Number,
  updated_timestamp: Date,
  updated_user_id: Number
}
