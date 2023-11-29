const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

exports.handler = async (event) => {
    const hashedPass = bcrypt.hashSync('ninjaSE123', 10);
    db.query("INSERT INTO VenueManager (username, password) VALUES (?, ?)", ["heineman", hashedPass]);
}