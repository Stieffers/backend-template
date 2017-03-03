"use strict";
const pg = require("pg");
const pgconfig_1 = require("../config/pgconfig");
const posts_1 = require("../handler/posts");
class PostsRoutes {
    constructor() {
        this.pool = new pg.Pool(pgconfig_1.createConfig());
    }
    static create(router) {
        const postsHandler = new posts_1.PostsHandler();
        router.get("/api/posts", (req, res, next) => {
            postsHandler.get(req, res, next);
        });
    }
}
exports.PostsRoutes = PostsRoutes;
