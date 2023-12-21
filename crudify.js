const config = require('./config');
const Helpers = require('./helpers');

class Crudify {
  static activeConnectionName = null; // Property to store active connection name

  static config(dbConfig) {
    return config.setup(dbConfig);
  }

  static ready(connectionName) {
    Crudify.activeConnectionName = connectionName;
  }
  static die(connectionName) {
    const connection = config.getConnection(connectionName);
    if (!connection) {
      throw new Error(`No connection found for name: ${connectionName}`);
    }

    connection.end(err => {
      if (err) {
        throw new Error('Error closing the database connection: ' + err.message);
      }
      console.log(`Connection ${connectionName} closed successfully.`);
    });
  }

  static getConnectionName() {
    if (!Crudify.activeConnectionName) {
      throw new Error('No active database connection. Call Crudify.ready(connectionName) first.');
    }
    return Crudify.activeConnectionName;
  }

  static create(data) {
    return {
      into: async (tableName) => {
        Helpers.validateIdentifier(tableName);
        const keys = Object.keys(data).join(', ');
        const values = Helpers.escapeValues(data).join(', ');
        const query = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;
        console.log(query);
        const connectionName = Crudify.getConnectionName();
        const connection = config.getConnection(connectionName);
        return new Promise((resolve, reject) => {
          connection.query(query, (error, results) => {
            if (error) reject(error);
            else resolve(results);
          });
        });
      }
    };
  }

  static read(columns) {
    return {
      where: (condition) => {
        return {
          from: async (tableName) => {
            Helpers.validateIdentifier(tableName);
            const query = `SELECT ${columns} FROM ${tableName} WHERE ${condition}`;
            console.log(query);
            const connectionName = Crudify.getConnectionName();
            const connection = config.getConnection(connectionName);
            return new Promise((resolve, reject) => {
              connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
              });
            });
          }
        };
      }
    };
  }

  static update(data) {
    return {
      from: (tableName) => {
        return {
          where: async (condition) => {
            Helpers.validateIdentifier(tableName);
            const updates = Helpers.buildSetClause(data);
            const query = `UPDATE ${tableName} SET ${updates} WHERE ${condition}`;
            console.log(query);
            const connectionName = Crudify.getConnectionName();
            const connection = config.getConnection(connectionName);
            return new Promise((resolve, reject) => {
              connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
              });
            });
          }
        };
      }
    };
  }

  static delete() {
    return {
      where: (condition) => {
        return {
          from: async (tableName) => {
            Helpers.validateIdentifier(tableName);
            const query = `DELETE FROM ${tableName} WHERE ${condition}`;
            console.log(query);
            const connectionName = Crudify.getConnectionName();
            const connection = config.getConnection(connectionName);
            return new Promise((resolve, reject) => {
              connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
              });
            });
          }
        };
      }
    };
  }
}

module.exports = Crudify;
