const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT venueID, venueName, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight FROM Venue WHERE vmIDVenueFK = (SELECT vmID FROM VenueManager WHERE username = ?)',[username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.handler = async (event) => {
    try {
        const username = event.username;
        const rows = await queryDatabase(username);

        return {
            statusCode: 200, 
            body: JSON.stringify(rows)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        };
    }
};