const pg = require('pg');
const postgresURL = 'postgres://localhost/algos';
const client = new pg.Client(postgresURL);

const connections = async () => {
  await client.connect();
};
connections();
module.exports = client;
