const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')


const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (section, showIDTicketFK) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT MAX(seatRow) AS numRows, MAX(seatCol) AS numCols FROM Ticket WHERE section = ? AND showIDTicketFK = ?', [section, showIDTicketFK], (error, rows) => {
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
        const section = event.section;
        const showIDTicketFK = event.showID;
        
        const seatData = await queryDatabase(section, showIDTicketFK);

        return {
            statusCode: 200, 
            body: JSON.stringify(seatData)
        }
    } catch (error) {

        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}