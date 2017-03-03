import * as express from "express";
import {PostsHandler} from "../handler/posts";

export class PostsRoutes {
  public static create(router: express.Router) {
    const postsHandler: PostsHandler = new PostsHandler();

    router.get("/api/posts", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      postsHandler.get(req, res, next);
    });

    router.post("/api/posts", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      postsHandler.post(req, res, next);
    });

    router.delete("/api/posts/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      postsHandler.delete(req, res, next);
    });
  }
}
