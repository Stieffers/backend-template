import * as express from "express";
import * as pg from "pg";
import {pgpool} from "../util/pgpool";
import {JwtService} from "../service/jwtService";
import {ProfileService} from "../service/profileService";
import {USER_BY_USERNAME} from "../queries/appUserQueries";
import {AppUser} from "../model/app_user";
import {ImageService} from "../service/imageService";

export class ProfileHandler {
  private pool: pg.Pool;
  private jwtService: JwtService;
  private profileService: ProfileService;
  private imageService: ImageService;

  constructor() {
    this.pool = pgpool.pool;
    this.jwtService = new JwtService();
    this.profileService = new ProfileService();
    this.imageService = new ImageService();
  }

  public get(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(USER_BY_USERNAME, [req.params.username]).then(result => {
      const user: AppUser = result.rows[0];
      user.password = null;

      return res.json({user: user});
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public put(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.profileService.updateProfileFields(req.body.first_name, req.body.last_name, req.body.biography,
      req.params.username, req.body.profile_image_id).then((results) => {
      console.log("Profile fields updated");
      const user_id = results.rows[0];
      return res.json({user_id: user_id, success: "Your profile changes have been saved."});
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public updateImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.imageService.insertImage(req, (image_id: number) => {
      this.profileService.updateProfileImage(image_id, req.params.username).then((results) => {
        return res.json({id: image_id, success: "Your profile image has been updated."});
      });
    });
  }
}
