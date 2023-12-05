
const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const queryActivateShow = (username, show) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT vmID FROM Shows WHERE vmIDShowsFK=?', [show],(error, rows) => {
            if (error) {
                reject(error);
            } else {
                db.query('SELECT checkvmID FROM VenueManager WHERE username=?', [username],(error, rows) => {
                    if (error){
                        reject(error);
                    }else if (vmID === checkvmID){
                        db.query('UPDATE Shows SET isActivated=1 WHERE showName=?', [show],(error, rows) => {
                            if (error){
                                reject(error);
                            } else {
                                resolve(rows);
                            }
                        })
                    } else {
                        return{
                            statusCode: 400,
                            body: "Venue does not belong to this Manager"
                        }
                    }
                })
                
            }
        })
    })
}

exports.handler = async (event) => {
    try {
        const username = event.username;
        const show = event.show;
        await queryActivateShow(username, show);
        

        return {
            statusCode: 200, 
            body: "Activation Successful"
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        }
    }
}