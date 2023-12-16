const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');


exports.handler = async (event) => {
    const db = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    const getdefaultPrice = (showID) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT price FROM Shows WHERE showID=? ', [showID], (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows[0].price);
                }
            });
        });
    };

    const querydeleteBlock = (blockName, price) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE Ticket SET blockName="Default", seatPrice=? WHERE blockName=?', [price, blockName], (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows);
                }
            });
        });
    };
    
    try {
        const showID = event.showID;
        const price = await getdefaultPrice(showID);
        const blockName=event.blockName;
        const rows= await querydeleteBlock(blockName, price)

    
        if (rows.affectedRows > 0) {
            return {
                statusCode: 200,
                body: "Block deleted and set to default"
            }
        }
        else {
            return {
                statusCode: 400,
                body: "Block not deleted"
            }
        }
    }
    catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: 'Internal Server Error' + error
        }
    }
}