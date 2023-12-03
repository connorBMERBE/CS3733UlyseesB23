const mysql = require('mysql');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDatabase = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT showName, Date, Time FROM Shows WHERE isActivated = ?', [true], (error, rows) => {
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
        const shows = queryDatabase();

        return {
            statusCode: 200, 
            body: shows
        }
    } catch (error) {

        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}