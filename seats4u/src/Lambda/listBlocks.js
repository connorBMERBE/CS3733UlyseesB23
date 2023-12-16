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
        const results = {};

        // Query for totalSeats, seatsSold, proceedsPerBlock, totalProceeds, and pricePerSeat
        db.query(`
            SELECT 
                blockName,
                section,
                MIN(seatRow) AS startRow,
                MAX(seatRow) AS endRow,
                MIN(seatCol) AS startCol,
                MAX(seatCol) AS endCol,
                COUNT(*) AS totalSeats,
                SUM(CASE WHEN isSold = 1 THEN 1 ELSE 0 END) AS seatsSold,
                COUNT(*) * AVG(CASE WHEN isSold = 1 THEN seatPrice ELSE 0 END) AS proceedsPerBlock,
                COUNT(*) * AVG(CASE WHEN isSold = 1 THEN seatPrice ELSE 0 END) AS totalProceeds,
                AVG(seatPrice) AS seatPrice
            FROM Seats4U_Prod.Ticket 
            WHERE showIDTicketFK = ?
            GROUP BY blockName, section;
                    `, [showID], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                results['blocks'] = rows;
                resolve(results);
            }
        });
    });
};



exports.handler = async (event) => {
    try {
        const showID = event.showID;
        const blocks = await queryDatabase(showID);

        if (Object.keys(blocks).length > 0) {
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