import * as express from "express";
import {ImagesHandler} from "../handler/images";

export class ImagesRoutes {
  public static create(router: express.Router) {
    const imagesHandler: ImagesHandler = new ImagesHandler();

    router.get("/api/images/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      imagesHandler.get(req, res, next);
    });

    router.post("/api/images", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      imagesHandler.post(req, res, next);
    });

    router.delete("/api/images/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      imagesHandler.delete(req, res, next);
    });
  }
}
