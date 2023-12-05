const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

exports.handler = async (event) => {
  // Prepare the INSERT statement
  const insertQuery = 'INSERT INTO Seat (section, row, column, venueIDSeatFK) VALUES (?, ?, ?, ?)';
  const insertStatement = pool.prepare(insertQuery);

  // Insert the seats in batches
  const batchSize = 100; // Adjust the batch size as needed
  for (let row = 1; row <= numRows; row++) {
    for (let column = 1; column <= numColumns; column++) {
      // Execute the prepared statement with each set of values
      await insertStatement.execute([venueID, section, row, column]);

      // If the batch size is reached, reset the prepared statement
      if ((row * numColumns + column) % batchSize === 0) {
        insertStatement.reset();
      }
    }
  }

  // Close the prepared statement
  insertStatement.close();

  console.log('Seats inserted successfully');

  return true;
}
