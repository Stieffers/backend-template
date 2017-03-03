"use strict";
function createConfig() {
    const config = {
        user: 'postgres',
        password: 'cactas',
        database: 'forumio',
        host: 'localhost'
    };
    return config;
}
exports.createConfig = createConfig;
