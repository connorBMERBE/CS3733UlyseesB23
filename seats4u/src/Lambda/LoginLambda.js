const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crazy = require('crypto');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.databas
});

const jwtSecret = crazy.randomBytes(Math.ceil(32 / 2)).toString("hex").slice(0, 32);

exports.login = async (event) => {
    const username = event.username;
    const password = event.password;
    
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM VenueManager WHERE username = ?", [username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                const user = rows[0];
                
                if (user && (bcrypt.compare(password, user.password))) {
                    //Generate a JWT Token
                    const token  = jwt.sign({userID: user.username}, jwtSecret, {expiresIn: '3h'});
                    return {
                        statusCode: 200, 
                        body: token,
                    };
                }

                else {
                    return {
                        statusCode: 401, 
                        body: "Invalid Credentials",
                    };
                }
            }
        } )
    })

}