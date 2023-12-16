const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (showID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT blockName, COUNT(*) AS totalSeats FROM Seats4U_Prod.Ticket WHERE showIDTicketFK = ? GROUP BY blockName;`, [showID], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                console.log(rows);
                resolve(rows);
            }
        });

        db.query(`SELECT blockName, COUNT(*) AS seatsSold, COUNT(*) * AVG(seatPrice) AS proceedsPerBlock, AVG(seatPrice) AS pricePerSeat FROM Seats4U_Prod.Ticket WHERE showIDTicketFK = ? AND isSold = 1 GROUP BY blockName;`, [showID], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                console.log(rows);
                resolve(rows);
            }
        });

        db.query(`SELECT blockName, COUNT(*) AS totalSeats, COUNT(*) * AVG(seatPrice) AS totalProceeds, AVG(seatPrice) AS pricePerSeat FROM Seats4U_Prod.Ticket WHERE showIDTicketFK = ? GROUP BY blockName;`, [showID], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                console.log(rows);
                resolve(rows);
            }
        });
    });
}

exports.handler = async (event) => {
    try {
        const showID = event.showID;
        const blocks = await queryDatabase(showID);

        if (blocks.length > 0) {
            return {
                statusCode: 200, 
                body: JSON.stringify(blocks)
            }   
        } else {
           return {
                statusCode: 200, 
                body: "No Blocks Found"
            }  
        }
        
        
    } catch (error) {

        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}