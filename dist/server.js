"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const api_1 = require("./routes/api");
const posts_1 = require("./routes/posts");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    config() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
    }
    routes() {
        let router;
        router = express.Router();
        api_1.ApiRoutes.create(router);
        posts_1.PostsRoutes.create(router);
        this.app.use(router);
    }
    api() {
    }
}
exports.Server = Server;
