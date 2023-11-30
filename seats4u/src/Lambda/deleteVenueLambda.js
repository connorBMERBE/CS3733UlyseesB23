
const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDeleteVenue = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT vmID FROM VenueManager WHERE username =?', [username],(error, rows) => {
            if (error) {
                reject(error);
            } else {
                if (rows.length > 0){
                   const vmID = rows[0].vmID;
                    db.query('DELETE FROM Venue WHERE vmIDVenueFK=?', [vmID],(error) => {
                        if(error){
                            reject(error);
                        } else {
                            resolve(rows);
                        }
                    })
                } else {
                    return{
                        statusCode: 400, 
                        body: "Venue Manager not found"
                    }
                }
                
            }
        })
    })
}

exports.handler = async (event) => {
    try {
        const username = event.username;
        await queryDeleteVenue(username);
        

        return {
            statusCode: 200, 
            body: "Deletion successful"
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}