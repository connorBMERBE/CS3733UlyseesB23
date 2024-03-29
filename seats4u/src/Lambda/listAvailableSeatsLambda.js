const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (showIDTicketFK) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Ticket WHERE showIDTicketFK = ?', [showIDTicketFK], (error, rows) => {
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
        const showID = event.showID;
        
        const seats = await queryDatabase(showID);
        console.log(seats);

        if (seats.length > 0) {
            return {
                statusCode: 200, 
                body: JSON.stringify(seats)
            }   
        } else {
           return {
                statusCode: 200, 
                body: "No Seats Found"
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