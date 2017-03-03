import * as express from "express";
import * as pg from "pg";
import {PagedResult} from "../model/pagedresult";
import {Post} from "../model/post";
import {pgpool} from "../util/pgpool";
import {LATEST_POSTS_PAGED, INSERT_POST, POST_BY_ID, DELETE_POST_BY_ID} from "../queries/postQueries";
import {JwtService} from "../service/jwtService";
import {AppUser} from "../model/app_user";
import {PostsHandler} from "./posts";
import {LATEST_LISTINGS_PAGED} from "../queries/listingQueries";
import {Listing} from "../model/listing";

export class ListingsHandler {
  private pool: pg.Pool;
  private jwtService: JwtService;

  constructor() {
    this.pool = pgpool.pool;
    this.jwtService = new JwtService();
  }

  public get(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(LATEST_LISTINGS_PAGED, [5, 0]).then(result => {
      return res.json(ListingsHandler.toPagedResult(result));
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public post(req: express.Request, res: express.Response, next: express.NextFunction) {
    const appUser: AppUser = this.jwtService.decode(req.headers['authorization']);
    if (appUser == null) {
      return res.status(401).json({error: "You must be logged in to post a post."});
    }

    const title = req.body.title;
    const body = req.body.body;

    let error = false;
    if (title == null || title == "") {
      error = true;
    }

    if (body == null || body == "") {
      error = true;
    }

    if (error) {
      return res.status(403).json({error: "The title and body fields are required."});
    }

    this.pool.query(INSERT_POST, [title, body, appUser.id]).then((result) => {
      return res.json({id: result.rows[0].id, message: "Your post has been saved."});
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    const appUser: AppUser = this.jwtService.decode(req.headers['authorization']);
    if (appUser == null) {
      return res.status(401).json({error: "You must be logged in to remove a post."});
    }

    this.pool.query(POST_BY_ID, [req.params.id]).then((result) => {
      if (result.rowCount == 0) {
        return res.status(404).json(new Error("The specified post does not exist."));
      }

      const post: Post = result.rows[0];
      if (appUser.roles.indexOf("ADMIN") > 0 || appUser.id === post.created_user_id) {
        return post.id;
      } else {
        return res.status(401).json(new Error("You do not have sufficient privileges to remove this post."));
      }
    }).then((id: Number) => {
      return this.pool.query(DELETE_POST_BY_ID, [id])
    }).then((result) => {
      return res.json({success: "The post has been deleted."});
    })
  }

  private static toPagedResult(listings: any): PagedResult<Listing> {
    let pagedResult: PagedResult<Listing> = new PagedResult<Listing>();
    for (let i = 0; i < listings.rows.length; i++) {
      pagedResult.data[listings.rows[i].id] = listings.rows[i];
      pagedResult.order.push(listings.rows[i].id);
    }

    return pagedResult;
  }
}
