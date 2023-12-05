const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (showIDTicketFK, section) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT section, seatRow, seatCol, price, Max(seatRow), Max(seatCol) FROM Seats4U_Test.Seat WHERE section = ? AND showIDTicketFK = ?', [section, showIDTicketFK], (error, rows) => {
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
        const seats = await queryDatabase();

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