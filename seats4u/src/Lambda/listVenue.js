const mysql = require('mysql');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT venueName FROM VENUE WHERE vmIDVenueFK = (SELECT vmID FROM VenueManager WHERE username = ?)',[username], (error, rows) => {
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
        event.username = username;
        const venues = queryDatabase();

        return {
            statusCode: 200, 
            body: venues
        }
    } catch (error) {

        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}