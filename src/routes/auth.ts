import * as express from "express";
import {AuthHandler} from "../handler/auth";

export class AuthRoutes {
  public static create(router: express.Router) {
    const authHandler: AuthHandler = new AuthHandler();

    router.get("/api/auth", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authHandler.get(req, res, next);
    });

    router.post("/api/auth", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authHandler.post(req, res, next);
    });

    router.post("/api/auth/reset", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authHandler.sendReset(req, res, next);
    });
  }
}
