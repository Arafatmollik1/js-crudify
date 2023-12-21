const Crudify = require('./index'); // Import your Crudify package

// Database configuration
const dbConfig = {
  host: DB_HOST, // replace with your DB host
  user: DB_USER, // replace with your DB username
  password: DB_PASSWORD, // replace with your DB password
  database: DB_DATABASE,  // replace with your DB name
};

// Configure Crudify to use your database
Crudify.config({
    name: 'myTestDB',
    ...dbConfig
  });
  

// Make the connection ready
Crudify.ready('myTestDB');

// Create
async function testCreate() {
    try {
      const data = {
        email: 'fromcrudify@crudify.com',
        usertype: 'a'
      };
  
      const result = await Crudify.create(data).into('webuser').execute();
      console.log('Create Result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Read
  async function testRead() {
    try {
      const result = await Crudify.read('*').from('webuser').execute();
      console.log('Read Result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Update
  async function testUpdate() {
    try {
      const newData = {
        usertype: 'b'
      };
  
      const result = await Crudify.update(newData).from('webuser').where("email = 'fromcrudify@crudify.com'").execute();
      console.log('Update Result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Delete
  async function testDelete() {
    try {
      const result = await Crudify.delete().from('webuser').where("email = 'fromcrudify@crudify.com'").execute();
      console.log('Delete Result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
    // Die (Close connection)
    async function testDie() {
        try {
            Crudify.die('myTestDB');
            console.log('Connection closed successfully.');
        } catch (error) {
            console.error('Error:', error);
        }
    }
    function logGreen(text) {
        console.log(`\x1b[32m${text}\x1b[0m`); // Green
      }

  async function runTests() {
    logGreen("---------The following is the result for creating an entry------------");
    await testCreate();
    logGreen("---------The following is the result for reading an entry------------");
    await testRead();
    logGreen("---------The following is the result for updating an entry------------");
    await testUpdate();
    logGreen("---------The following is the result for reading an entry once again after update------------");
    await testRead(); 
    logGreen("---------The following is the result for deleting an entry------------");
    await testDelete();
    logGreen("---------The following is the result for reading an entry after deletion------------");
    await testRead();
    logGreen("---------The following is the result for closing the database connection------------");
    await testDie();
  }
  
  runTests();
