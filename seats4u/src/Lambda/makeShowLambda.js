const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (username, venueName, showName, date, time) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT vmID FROM VenueManager WHERE username = ?`, [username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                
                if(rows.length > 0){
                    const vmIDShowsFK = rows[0].vmIDFK;
                    db.query (`SELECT venueID FROM Venue WHERE vmIDvenueFK = ?`, [vmIDShowsFK], (error, rows) => {
                        if (error){
                            reject(error)
                        } else{
                            const venueIDShowsFK = rows[0].venueID

                            db.query('INSERT INTO Show (showName, date, time, vmIDShowsFK, venueIDShowsFK) VALUES (?, ?, ?, ?, ?)', [showName, date, time, vmIDShowsFK, venueIDShowsFK], (insertError, result) => {
                                if (insertError) {
                                    reject(insertError);
                                } else {
                                    resolve(result);
                                }
                            });
                        }
                    }) 
                } else {
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
    const venueName = event.venueName;
    const showName = event.showName;
    const date = event.date;
    const time = event.time;
  
    try {
        await queryDatabase(username, venueName, showName, date, time) 
        
        return {
            statusCode: 200, 
            body: 'Successfully Created a Show'
        };
    }
    catch (error) {
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        };
    }
  };