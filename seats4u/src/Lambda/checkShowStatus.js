const mysql = require('mysql');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = (showID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT isActivated FROM Shows WHERE showID = ?', [showID], (error, rows) => {
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
        const status = queryDatabase(showID);

        return {
            statusCode: 200, 
            body: status
        }
    } catch (error) {

        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}