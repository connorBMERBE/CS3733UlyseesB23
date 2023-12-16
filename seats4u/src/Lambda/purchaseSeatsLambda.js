const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

exports.handler = async (event) => {
    try {
        // Assuming the input event contains an array of seats
        const seats = event.seats;
        const showID = event.showID;
        const alreadySold = [];
    
        // Iterate through the seats and check if they are sold
        for (const seat of seats) {
            const isSold = await checkIfSeatIsSold(showID, seat);
            
            // If the seat is not sold, mark it as sold
            if (isSold) {
                alreadySold.push(seat);
            } else {
                await markSeatAsSold(showID, seat);
            }
        }
        
        if (alreadySold.length > 0) {
            return { 
                statusCode: 201, 
                body: alreadySold
            };
        } else {
            return { 
                statusCode: 200, 
                body: "Congrats on your Purchase"
            };
        }

    } catch (error) {
        console.error('Error:', error);
        return { 
            statusCode: 500, 
            body: 'Internal Server Error' 
        };
    }
};

// Function to check if a seat is sold
const checkIfSeatIsSold = (showID, seat) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT isSold FROM Ticket WHERE showIDTicketFK = ? AND section = ? AND seatRow = ? AND seatCol = ?', [showID, seat.section, seat.row, seat.column],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            // Resolve with true if the seat is sold, false otherwise
            resolve(results.length > 0 && results[0].isSold === 1);
          }
        }
      );
    });
};
  
// Function to mark a seat as sold
const markSeatAsSold = (showID, seat) => {
    return new Promise((resolve, reject) => {
        db.query(
        'UPDATE Ticket SET isSold = 1 WHERE showIDTicketFK = ? AND section = ? AND seatRow = ? AND seatCol = ?', [showID, seat.section, seat.row, seat.column],
        (error) => {
            if (error) {
            reject(error);
            } else {
            resolve();
            }
        }
        );
    });
};