"use strict";
const pg = require("pg");
const pgconfig_1 = require("../config/pgconfig");
const results_1 = require("../model/results");
class PostsHandler {
    constructor() {
        this.pool = new pg.Pool(pgconfig_1.createConfig());
    }
    get(req, res, next) {
        this.pool.connect(function (err, client, done) {
            if (err)
                throw err;
            client.query('SELECT p.*, au.username, au.first_name, au.last_name FROM post p INNER JOIN app_user au ON au.id = p.created_user_id ORDER BY p.created_timestamp DESC', function (err, result) {
                if (err)
                    throw err;
                done();
                let results = new results_1.Results();
                for (let i = 0; i < result.rows.length; i++) {
                    results.data[result.rows[i].id] = result.rows[i];
                    results.order.push(result.rows[i].id);
                }
                res.json(results);
            });
        });
    }
}
exports.PostsHandler = PostsHandler;
