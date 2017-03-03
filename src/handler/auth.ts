import * as express from "express";
import * as pg from "pg";
import * as jwt from "jsonwebtoken";

import {Crypto} from "../util/crypto";
import {pgpool} from "../util/pgpool";
import {AppUser} from "../model/app_user";
import {ROLES_BY_USER_ID, USER_BY_USERNAME, USER_BY_ID} from "../queries/appUserQueries";
import {EmailService} from "../service/emailService";
import {INSERT_TOKEN} from "../queries/tokenQueries";
import {RegisterHandler} from "./register";

const jwtConfig = require("../config/jwt.json");

export class AuthHandler {
  private pool: pg.Pool;
  private crypto: Crypto;
  private emailService: EmailService;

  constructor() {
    this.pool = pgpool.pool;
    this.crypto = new Crypto();
    this.emailService = new EmailService();
  }

  public get(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(USER_BY_ID, []).then(result => {
      res.json(result);
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public post(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(USER_BY_USERNAME, [req.body.username]).then((result) => {
      if (result.rowCount == 0) {
        return res.status(401).json({error: "Invalid username and password"});
      }

      const user = result.rows[0] as AppUser;
      if (user.activated === false) {
        return res.status(401).json({error: "Invalid username and password"});
      }

      const hashed = user.password;
      const plainText = req.body.password;

      this.crypto.validatePassword(plainText, hashed, (err: Error, same: boolean) => {
        if (err) throw err;

        if (same) {
          user.password = "";
          this.pool.query(ROLES_BY_USER_ID, [user.id]).then((result) => {
            result.rows = result.rows.map((row) => (row.role));
            user.roles = result.rows;

            jwt.sign(user, jwtConfig.jwt.secret, {expiresIn: "30 days"}, (err: Error, token: string) => {
              req.headers['Bearer'] = token;
              res.json({token: token, user: user});
            });
          });
        } else {
          return res.status(401).json({error: "Invalid username and password"});
        }
      });
    }).catch(e => {
      console.error('Error querying user', e.message, e.stack);
    });
  }

  public sendReset(req: express.Request, res: express.Response, next: express.NextFunction) {
    const that = this;
    const username = req.body.username;
    this.pool.query(USER_BY_USERNAME, [username]).then((result) => {
      const userId = result.rows[0].id;
      const token = RegisterHandler.randomHash(32);
      const today: number = Date.now();
      const expirationDate = new Date(today + 1000 * 60 * 60 * 24 * 5);

      return that.pool.query(INSERT_TOKEN, [userId, token, expirationDate]);
    }).then((result) => {
      that.emailService.mailResetLink(result.rows[0].token, username);

      return res.json({username: username});
    }).catch((e: any) => {
      console.error(e);
    });
  }
}
