const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool({
  host: db_access.config.host,
  user: db_access.config.user,
  password: db_access.config.password,
  database: db_access.config.database
});

const countAllSeats = (showID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS totalSeats FROM Ticket WHERE showIDTicketFK = ?',[showID], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0].totalSeats);
      }
    });
  });
};

const countSoldSeats = (showID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS soldSeats FROM Ticket WHERE isSold = 1 AND showIDTicketFK = ?',[showID], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0].soldSeats);
      }
    });
  });
};

const sumSoldSeats = (showID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT SUM(seatPrice) AS sumSoldSeats FROM Ticket WHERE isSold = 1 AND showIDTicketFK = ?',[showID], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0].sumSoldSeats || 0); // Default to 0 if no sold seats
      }
    });
  });
};

exports.handler = async (event) => {
  try {
    const showID = event.showID;

    // Call the functions to get counts and sum
    const totalSeats = await countAllSeats(showID);
    const soldSeats = await countSoldSeats(showID);
    const sumSoldSeatsValue = await sumSoldSeats(showID);

    console.log('Total Seats:', totalSeats);
    console.log('Sold Seats:', soldSeats);
    console.log('Sum of Sold Seats:', sumSoldSeatsValue);

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalSeats,
        soldSeats,
        sumSoldSeatsValue
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
