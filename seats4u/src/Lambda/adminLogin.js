const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crazy = require('crypto');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const jwtSecret = crazy.randomBytes(Math.ceil(32 / 2)).toString("hex").slice(0, 32);

exports.handler = async (event) => {
    const username = event.username;
    const password = event.password;

    try {
        const rows = await queryDatabase('Administrator', username);
        let role = 'venue manager';

        if (rows.length > 0) {
            const user = rows[0];

            if (bcrypt.compareSync(password, user.password)) {
                // Generate a JWT Token
                const token = jwt.sign({ userID: user.username, role }, jwtSecret, { expiresIn: '3h' });
                return {
                    statusCode: 200,
                    body: {token, role}
                };
            }
        }

        return {
            statusCode: 401,
            body: "Invalid Credentials",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};

const queryDatabase = (tableName, username) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${tableName} WHERE username = ?`, [username], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};