const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (username, venueName, totalSeats, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT vmID FROM VenueManager WHERE username = ?`, [username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                if (rows.length > 0) {
                    const vmIDFK = rows[0].vmID;
                    
                    //Insert into Venues table
                    db.query('INSERT INTO Venue (totalSeats, venueName, vmIDVenueFK,  rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [totalSeats, venueName, vmIDFK, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight], (insertError, result) => {
                        if (insertError) {
                            reject(insertError);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    reject(JSON.stringify({
                      statusCode: 500,
                      body: 'Venue Manager not found'
                    }));
                }
            }
        });
    });
};

exports.handler = async (event) => {
  const username = event.username;
  const venueName = event.venueName;
  const totalSeats = event.totalSeats;
  const rowLeft = event.rowLeft;
  const colLeft = event.colLeft;
  const rowCenter = event.rowCenter;
  const colCenter = event.colCenter;
  const rowRight = event.rowRight;
  const colRight = event.colRight;
  
  
  try {
      await queryDatabase(username, venueName, totalSeats, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight);
      
      return {
          statusCode: 200, 
          body: 'Successfully Created a Venue'
      };
  }
  catch (error) {
        console.log(error);
      return {
          statusCode: 500, 
          body: error
      };
  }
};