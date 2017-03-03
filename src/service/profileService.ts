import * as pg from "pg";
import {QueryResult} from "pg";
import {JwtService} from "./jwtService";
import {pgpool} from "../util/pgpool";
import {UPDATE_USER_BY_USERNAME, UPDATE_PROFILE_IMAGE_BY_USERNAME} from "../queries/appUserQueries";

export class ProfileService {
  private pool: pg.Pool;
  private jwtService: JwtService;

  constructor() {
    this.pool = pgpool.pool;
    this.jwtService = new JwtService();
  }

  public updateProfileFields(username: string, first_name: string, last_name: string, biography: string, profile_image_id: number): Promise<QueryResult> {
    return this.pool.query(UPDATE_USER_BY_USERNAME, [username, first_name, last_name, biography, profile_image_id]);
  }

  public updateProfileImage(image_id: number, username: string): Promise<QueryResult> {
    return this.pool.query(UPDATE_PROFILE_IMAGE_BY_USERNAME, [image_id, username]);
  }
}
