const mysql = require('mysql');
let connections = {};

const setup = (dbConfig) => {
  // Create and store the MySQL connection
  connections[dbConfig.name] = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  });

  // Connect to the MySQL database
  connections[dbConfig.name].connect(err => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }

    console.log('Connected to database as ID ' + connections[dbConfig.name].threadId);
  });

  return true;
};

const getConnection = (name) => connections[name];

module.exports = { setup, getConnection };
