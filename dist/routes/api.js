"use strict";
const pg = require("pg");
const pgConfig = {
    user: 'postgres',
    database: 'forumio',
    password: 'cactas',
    host: 'localhost',
    max: 10,
    idleTimeoutMillis: 30000
};
const pool = new pg.Pool(pgConfig);
class ApiRoutes {
    static create(router) {
        router.get("/api", (req, res, next) => {
            new ApiRoutes().get(req, res, next);
        });
    }
    get(req, res, next) {
        res.json({ message: 'hooray! welcome to our api!' });
    }
}
exports.ApiRoutes = ApiRoutes;
