const path = require('path');

module.exports = {
  client: "postgresql",
  connection: {
    database: 'impacter-posts-dev',
    host: 'grpc-db',
    port: 5432,
    user: 'dev',
    password: 'dev',
  },
  migrations: {
    directory: path.join(__dirname, 'db', 'migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'db', 'seeds'),
  },
};
