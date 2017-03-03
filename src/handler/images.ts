import * as express from "express";
import * as pg from "pg";
import {pgpool} from "../util/pgpool";
import {DELETE_POST_BY_ID} from "../queries/postQueries";
import {JwtService} from "../service/jwtService";
import {Image} from "../model/image";
import {IMAGE_BY_ID} from "../queries/imageQueries";
import {ImageService} from "../service/imageService";

export class ImagesHandler {
  private pool: pg.Pool;
  private jwtService: JwtService;
  private imageService: ImageService;

  constructor() {
    this.pool = pgpool.pool;
    this.jwtService = new JwtService();
    this.imageService = new ImageService();
  }

  public get(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(IMAGE_BY_ID, [req.params.id]).then(result => {
      res.setHeader("Content-Type", result.rows[0].mime_type);
      res.setHeader("Content-Length", result.rows[0].blob.length);
      res.write(new Buffer(result.rows[0].blob));
      return res.status(200);
    }).catch(e => {
      console.error('Error querying', e.message, e.stack);
    });
  }

  public post(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.imageService.insertImage(req, (image_id: number) => {
      return res.json({id: image_id, message: "Your image has been saved."});
    });
  }

  public delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.pool.query(IMAGE_BY_ID, [req.params.id]).then((result) => {
      if (result.rowCount == 0) {
        return res.status(404).json(new Error("The specified image does not exist."));
      }

      const image: Image = result.rows[0];
      return image.id;
    }).then((id: Number) => {
      return this.pool.query(DELETE_POST_BY_ID, [id])
    }).then((result) => {
      return res.json({success: "The image has been deleted."});
    })
  }
}
