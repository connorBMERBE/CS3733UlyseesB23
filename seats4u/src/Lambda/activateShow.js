
const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryActivateShow = (showID) => {
    return new Promise((resolve, reject) => {
        console.log("done1");
        db.query('UPDATE Shows SET isActivated=1 WHERE showID=?', [showID],(error, rows) => {
            console.log("done2");
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
        const showID = event.showID;
        const response = await queryActivateShow(showID);
        
        console.log(response);
        if (response.affectedRows === 1) {
            return {
                statusCode: 200, 
                body: "Activation Successful"
            };
        } else {
            return {
                statusCode: 400,
                body: 'Show not found or too many shows found'
            }
        }
    } catch (error) {
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        };
    }
};