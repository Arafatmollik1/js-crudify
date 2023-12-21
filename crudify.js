const config = require('./config');
const Helpers = require('./helpers');

class Crudify {
  static activeConnectionName = null;

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
    const queryBuilder = new QueryBuilder();
    return queryBuilder.create(data);
  }

  static read(columns) {
    const queryBuilder = new QueryBuilder();
    return queryBuilder.read(columns);
  }

  static update(data) {
    const queryBuilder = new QueryBuilder();
    return queryBuilder.update(data);
  }

  static delete() {
    const queryBuilder = new QueryBuilder();
    return queryBuilder.delete();
  }
}

class QueryBuilder {
  constructor() {
    this.query = '';
    this.type = '';
  }

  create(data) {
    this.type = 'INSERT';
    this.data = data;
    return this;
  }

  read(columns) {
    this.type = 'SELECT';
    this.columns = columns;
    return this;
  }

  update(data) {
    this.type = 'UPDATE';
    this.data = data;
    return this;
  }

  delete() {
    this.type = 'DELETE';
    return this;
  }

  where(condition) {
    this.condition = condition;
    return this;
  }

  from(tableName) {
    this.tableName = tableName;
    return this;
  }

  into(tableName) {
    this.tableName = tableName;
    return this;
  }

  async execute() {
    let query = '';
    Helpers.validateIdentifier(this.tableName);

    const connectionName = Crudify.getConnectionName();
    const connection = config.getConnection(connectionName);
    if (!connection) {
      throw new Error(`No connection found for name: ${connectionName}`);
    }

    switch (this.type) {
      case 'INSERT':
        const keys = Object.keys(this.data).join(', ');
        const values = Helpers.escapeValues(this.data).join(', ');
        query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`;
        break;
      case 'SELECT':
        query = `SELECT ${this.columns} FROM ${this.tableName}`;
        if (this.condition) {
          query += ` WHERE ${this.condition}`;
        }
        break;
      case 'UPDATE':
        const updates = Helpers.buildSetClause(this.data);
        query = `UPDATE ${this.tableName} SET ${updates}`;
        if (this.condition) {
          query += ` WHERE ${this.condition}`;
        }
        break;
      case 'DELETE':
        query = `DELETE FROM ${this.tableName}`;
        if (this.condition) {
          query += ` WHERE ${this.condition}`;
        }
        break;
      default:
        throw new Error('Invalid query type');
    }

    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          reject(error);
        } else {
          console.log('Query executed successfully:', query);
          resolve(results);
        }
      });
    });
  }
}

module.exports = Crudify;
