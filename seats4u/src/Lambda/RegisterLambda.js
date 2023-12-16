const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

exports.handler = async (event) => {
    return new Promise((resolve, reject) => {
        const hashedPass = bcrypt.hashSync(event.password, 10);
        db.query("INSERT INTO VenueManager (username, password) VALUES (?, ?)", [event.username, hashedPass], (error, rows) => {
            if (error) {
                return reject(error);
            } 
            
            if (rows && (rows.affectedRows == 1)) {
                return resolve(true);
            } else {
                return resolve (false);
            }
        } ); });
    
}