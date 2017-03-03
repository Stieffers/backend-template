import * as express from "express";
import {ImagesHandler} from "../handler/images";
import {ProfileHandler} from "../handler/profile";

export class ProfileRoutes {
  public static create(router: express.Router) {
    const profileHandler: ProfileHandler = new ProfileHandler();

    router.get("/api/profile/:username", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      profileHandler.get(req, res, next);
    });

    router.put("/api/profile/:username", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      profileHandler.put(req, res, next);
    });

    router.put("/api/profile/image/:username", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      profileHandler.updateImage(req, res, next);
    });
  }
}
