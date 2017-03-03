import * as pg from "pg";
import {QueryResult} from "pg";
import * as express from "express";
import * as fs from "fs";
import * as multiparty from "multiparty";
import {JwtService} from "./jwtService";
import {pgpool} from "../util/pgpool";
import {INSERT_IMAGE} from "../queries/imageQueries";

export class ImageService {
  private pool: pg.Pool;
  private jwtService: JwtService;

  constructor() {
    this.pool = pgpool.pool;
    this.jwtService = new JwtService();
  }

  public insertImage(req: express.Request, callback: Function) {
    const that = this;
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      let files_to_upload = files.data;
      const read_file = fs.readFileSync(files_to_upload[0].path);
      that.pool.query(INSERT_IMAGE, [read_file, files_to_upload[0].originalFilename, req.header("mime-type")]).then((result: QueryResult) => {
        const image_id: number = result.rows[0].id;
        return callback(image_id);
      });
    });
  }
}
