const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (username, showName, date, time, price) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT vmID FROM VenueManager WHERE username = ?`, [username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                
                if(rows.length > 0){
                    const vmIDShowsFK = rows[0].vmID;
                    db.query (`SELECT venueID FROM Venue WHERE vmIDvenueFK = ?`, [vmIDShowsFK], (error, rows) => {
                        if (error){
                            reject(error)
                        } else{
                            const venueIDShowsFK = rows[0].venueID

                            db.query('INSERT INTO Shows (showName, showDate, time, vmIDShowsFK, venueIDShowsFK, price) VALUES (?, ?, ?, ?, ?, ?)', [showName, date, time, vmIDShowsFK, venueIDShowsFK, price], (insertError, result) => {
                                if (insertError) {
                                    reject(insertError);
                                } else {
                                    resolve(result);
                                }
                            });
                        }
                    }) 
                } else {
                    console.log(error);
                    reject(JSON.stringify({
                    statusCode: 500,
                    body: 'Venue Manager not found'
                    }));
                }
            }});
          });
      };
  
  exports.handler = async (event) => {
    const username = event.username;
    const showName = event.showName;
    const date = event.date;
    const time = event.time;
    const price = event.price;
  
    try {
        const response = await queryDatabase(username, showName, date, time, price) 
        console.log(response);
        return {
            statusCode: 200, 
            body: response.insertId
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        };
    }
  };