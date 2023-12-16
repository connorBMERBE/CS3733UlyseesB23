const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (venueID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT showID, showName, showDate, isActivated, isPassed FROM Shows WHERE venueIDShowsFK = ?', [venueID], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        })
    })
}

exports.handler = async (event) => {
    try {
        const venueID = event.venueID;
        const shows = await queryDatabase(venueID);
        console.log(shows);
        if (shows.length > 0) {
            return {
                statusCode: 200, 
                body: JSON.stringify(shows)
            }
        } else {
            return {
                statusCode: 200, 
                body: JSON.stringify([])
            }   
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}