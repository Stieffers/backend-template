import * as express from "express";
import {RegisterHandler} from "../handler/register";

export class RegisterRoutes {
  public static create(router: express.Router) {
    const registerHandler: RegisterHandler = new RegisterHandler();

    router.get("/api/register/:username", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      registerHandler.get(req, res, next);
    });

    router.get("/api/register/activate/:token", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      registerHandler.activate(req, res, next);
    });

    router.post("/api/register", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      registerHandler.post(req, res, next);
    })
  }
}
