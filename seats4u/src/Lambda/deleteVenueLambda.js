
const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryDeleteVenue = (username) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM VenueManager WHERE username=?', [username],(error, rows) => {
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
        const username = event.username;
        const rows = await queryDeleteVenue(username);
        
        if (rows.affectedRows > 0) {
            return {
                statusCode: 200, 
                body: "Deletion successful"
            }   
        } else {
            return{
                statusCode: 400, 
                body: "Venue Manager not found"
            }
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}