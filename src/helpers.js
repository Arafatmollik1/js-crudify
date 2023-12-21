const mysql = require('mysql');

class Helpers {
    // Escapes values to prevent SQL injection
    static escapeValues(data) {
      return Object.values(data).map(value => mysql.escape(value));
    }

    // Builds a SQL SET clause for update queries
    static buildSetClause(data) {
      return Object.keys(data)
        .map(key => `${key} = ${mysql.escape(data[key])}`)
        .join(', ');
    }

    // Validates table names, column names, etc., to prevent SQL injection
    static validateIdentifier(identifier) {
      if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
        throw new Error('Invalid identifier: ' + identifier);
      }
    }
}

module.exports = Helpers;
