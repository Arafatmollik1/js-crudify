const config = require('./config');
const Helpers = require('./helpers');

class Crudify {
  static config(dbConfig) {
    return config.setup(dbConfig);
  }

  static ready(connectionName) {
    const connection = config.getConnection(connectionName);
    if (!connection) {
      throw new Error(`No connection found for name: ${connectionName}`);
    }
    return connection;
  }

  static create(data) {
    return {
      into: async (tableName) => {
        Helpers.validateIdentifier(tableName);
        const keys = Object.keys(data).join(', ');
        const values = Helpers.escapeValues(data).join(', ');
        const query = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;

        const connection = config.getConnection(/* connectionName */);
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
            
            const connection = config.getConnection(/* connectionName */);
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

            const connection = config.getConnection(/* connectionName */);
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

            const connection = config.getConnection(/* connectionName */);
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
