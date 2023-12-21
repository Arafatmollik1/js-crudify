
# js-crudify

Crudify is a Node.js package designed to simplify Create, Read, Update, and Delete (CRUD) operations in JavaScript backends. It abstracts the complexity of direct database interactions, offering a streamlined way to interact with databases.

## Features

- Simple and intuitive API for CRUD operations
- Easy configuration and management of database connections
- Built-in methods for common database interactions
- Support for MySQL databases

## Getting Started

### Prerequisites

- Node.js installed
- MySQL database accessible

### Installation

```
npm install js-crudify
```

### Configuration
Configure the database connection details in the .env file:
```
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_DATABASE=yourdatabase
```
Replace the values with your actual database credentials.

### Usage
Import and configure Crudify in your project:

```
const Crudify = require('crudify');

Crudify.config({
  name: 'myDatabaseConnection',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

Crudify.ready('myDatabaseConnection');
```

Perform CRUD operations:

javascript
```
// Create example
await Crudify.create({ column1: 'value1' }).into('tableName').execute();

// Read example
await Crudify.read('*').where('condition').from('tableName').execute();

// Update example
await Crudify.update({ column1: 'newValue' }).from('tableName').where('condition').execute();

// Delete example
await Crudify.delete().where('condition').from('tableName').execute();
```

## Testing
test.js is included to demonstrate how to test CRUD operations using Crudify. To run the tests, execute:

```
node test.js
```
For convinience you can just create a table in your database called 'webuser' and just run the code and see the console log in your backend to see what is happening!

### Contributing
Contributions to improve Crudify are welcome. Please fork the repository and submit a pull request with your changes.

License
This project is licensed under the MIT License.


### Notes for Customization:

- Replace `https://github.com/yourusername/crudify.git` with the actual URL of your GitHub repository.
- Modify any sections as needed to more accurately reflect the specifics of your `Crudify` app, such as additional features or different configuration steps.
- Ensure that the license link at the bottom matches the actual license file in your repository, if you have one.

This README provides a basic structure to help users understand and use your `Crudify` package effectively.




