import * as express from "express";
import {PostsHandler} from "../handler/posts";
import {ListingsHandler} from "../handler/listings";

export class ListingsRoutes {
  public static create(router: express.Router) {
    const listingsHandler: ListingsHandler = new ListingsHandler();

    router.get("/api/listings", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      listingsHandler.get(req, res, next);
    });

    router.post("/api/listings", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      listingsHandler.post(req, res, next);
    });

    router.put("/api/listings/:slug", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      listingsHandler.post(req, res, next);
    });

    router.delete("/api/listings/:slug", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      listingsHandler.delete(req, res, next);
    });
  }
}
