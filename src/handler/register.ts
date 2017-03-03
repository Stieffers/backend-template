import * as express from "express";
import * as pg from "pg";
import {Crypto} from "../util/crypto";
import {randomBytes} from 'crypto';
import {pgpool} from "../util/pgpool";
import {USER_BY_USERNAME, INSERT_USER, ACTIVATE_USER_BY_ID, INSERT_USER_ROLE} from "../queries/appUserQueries";
import {INSERT_TOKEN, TOKEN_BY_TOKEN, DELETE_TOKEN_BY_TOKEN} from "../queries/tokenQueries";
import {Roles} from "../model/enum/roles";
import {EmailService} from "../service/emailService";

export class RegisterHandler {
  private pool: pg.Pool;
  private crypto: Crypto;
  private emailService: EmailService;

  constructor() {
    this.pool = pgpool.pool;
    this.crypto = new Crypto();
    this.emailService = new EmailService();
  }

  public get(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(USER_BY_USERNAME, [req.params.username]).then(result => {
      if (result.rowCount > 0) {
        res.json("Specified email address is already in use.");
      } else {
        res.json("");
      }
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public activate(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(TOKEN_BY_TOKEN, [req.params.token]).then(result => {
      let userId: number;
      if (result.rowCount > 0) {
        const row = result.rows[0];
        userId = row.id;
        return this.pool.query(ACTIVATE_USER_BY_ID, [row.id]).then((result) => {
          return this.pool.query(DELETE_TOKEN_BY_TOKEN, [req.params.token])
        }).then((result) => {
          return this.pool.query(INSERT_USER_ROLE, [userId, Roles.USER])
        }).then((result) => {
          return res.json({activated: true, success: "The account has been activated."});
        }).catch(e => {
          console.error('Error removing token: ', e.message, e.stack);
          return res.json({activated: false, error: "Invalid token specified."});
        });
      } else {
        return res.json({activated: false, error: "Invalid token specified."});
      }
    }).catch(e => {
      console.error('Error activating user: ', e.message, e.stack);
    });
  }

  public post(req: express.Request, res: express.Response, next: express.NextFunction) {
    const that = this;
    this.pool.query(USER_BY_USERNAME, [req.body.username]).then((result) => {
      if (result.rowCount == 1) {
        return res.status(404).json({error: "Specified email address is already in use."});
      } else {
        const password = req.body.password;
        const username = req.body.username;

        this.crypto.hashPassword(password, function (err: Error, encrypted: string) {
          that.pool.query(INSERT_USER, [username, encrypted]).then((result: any) => {
            const userId = result.rows[0].id;
            const token = RegisterHandler.randomHash(32);
            const today: number = Date.now();
            const expirationDate = new Date(today + 1000 * 60 * 60 * 24 * 5);

            return that.pool.query(INSERT_TOKEN, [userId, token, expirationDate]);
          }).then((result) => {
            that.emailService.mailActivationLink(result.rows[0].token, username);

            return res.json({username: username});
          }).catch((e: any) => {
            console.error(e);
          });
        })
      }
    }).catch(e => {
      console.error('Error querying user', e.message, e.stack);
    });
  }

  public static randomHash(nChar: number) {
    const bytes = randomBytes(nChar);

    let str = bytes.toString('hex');
    if (str.length > nChar) {
      str = str.substr(0, nChar);
    }

    return str;
  }
}
