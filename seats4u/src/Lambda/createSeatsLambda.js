const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool({
  host: db_access.config.host,
  user: db_access.config.user,
  password: db_access.config.password,
  database: db_access.config.database
});

exports.handler = async (event) => {
  const section = event.section;
  const numRows = event.numRows;
  const numColumns = event.numColumns;
  const showIDTicketFK = event.showID;

  // Retrieve the show price from the Shows table
  const getPriceQuery = 'SELECT price FROM Shows WHERE showID = ?';

  return new Promise((resolve, reject) => {
    db.query(getPriceQuery, [showIDTicketFK], (priceError, priceRows) => {
      if (priceError) {
        reject(priceError);
        return;
      }

      if (priceRows.length === 0) {
        reject('Show not found');
        return;
      }

      const showPrice = priceRows[0].price;

      // Insert the seats in batches
      const seats = [];
      for (let row = 1; row <= numRows; row++) {
        for (let column = 1; column <= numColumns; column++) {
          // Use the retrieved show price for each seat
          const array = [showIDTicketFK, section, row, column, showPrice];
          seats.push(array);
        }
      }

      const placeholders = seats.map(() => '(?, ?, ?, ?, ?)').join(',');
      const flattenedValues = seats.reduce((acc, val) => acc.concat(val), []);

      const insertQuery = `INSERT INTO Ticket (showIDTicketFK, section, seatRow, seatCol, seatPrice) VALUES ${placeholders}`;

      // Execute the prepared statement with each set of values
      db.query(insertQuery, flattenedValues, (insertError, insertRows) => {
        if (insertError) {
          reject(insertError);
        } else {
          if (insertRows.affectedRows > 0) {
            resolve({
              statusCode: 200,
              body: 'Insertion Successful'
            });
          } else {
            resolve({
              statusCode: 400,
              body: 'Could not insert seats'
            });
          }
        }
      });
    });
  });
};