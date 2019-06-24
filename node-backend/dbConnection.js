const config = require('./config');
const knex = require('knex')({
    client: 'mysql2',
    connection: config.db.mariadb
});

module.exports = knex;