import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as path from "path";
import {PostsRoutes} from "./routes/posts";
import {AuthRoutes} from "./routes/auth";
import {RegisterRoutes} from "./routes/register";
import {ImagesRoutes} from "./routes/images";
import {ProfileRoutes} from "./routes/profile";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import {ListingsRoutes} from "./routes/listings";

export class Server {
  public app: express.Application;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();

    this.config();
    this.routes();
    this.api();
  }

  public config() {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(methodOverride());

    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });
  }

  public routes() {
    let router: express.Router;
    router = express.Router();

    ImagesRoutes.create(router);
    PostsRoutes.create(router);
    AuthRoutes.create(router);
    RegisterRoutes.create(router);
    ProfileRoutes.create(router);
    ListingsRoutes.create(router);

    this.app.use(router);
  }

  public api() {

  }
}
