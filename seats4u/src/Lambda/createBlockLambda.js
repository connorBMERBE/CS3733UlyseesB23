const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

const db = mysql.createPool( {
    host: db_access.config.host, 
    user: db_access.config.user, 
    password: db_access.config.password, 
    database: db_access.config.database
});

const another = (showID, i, j, blockName, price, section) => {
    return new Promise((resolve, reject) => {
        console.log(showID)
        console.log(i)
        console.log(j)
    db.query('UPDATE Ticket SET seatPrice= ?, blockName= ? WHERE (showIDTicketFK= ?) AND (seatRow= ?) AND (seatCol= ?) AND (section= ?)', [price, blockName, showID, i, j, section], (error, rows) => {
        if (error){
            return reject(error);
        } else{
            return resolve(rows);
        }
    });
    });
    
};

const queryDatabase = (showName) => {
    
    return new Promise((resolve, reject) => {
        console.log("start");
        db.query(`SELECT showID FROM Shows WHERE showName = ?`, [showName], (error, rows) => {
            if (error) {
                console.log("error");
                reject(error);
            } else {
                return resolve(rows[0].showID);
                // console.log("success");
                // console.log(rows[0].showID);
                // if(rows.length > 0){
                //     const showID = rows[0].showID;
                    
                //     let i ;
                //     let j;
                //     for (i = startRow; i <= endRow; i++){
                //         for (j = startCol; i <= endCol; i++){
                //             db.query('UPDATE Ticket SET seatPrice=? AND blockName=? WHERE (showIDTicketFK=?) AND (seatRow=?) AND (seatCol=?) AND (section=?)', [price, blockName, showID, i, j, section], (error, rows) => {
                //                 if (error){
                //                     return reject(error);
                //                 } else{
                //                     return resolve(rows);
                                
                //                 }
                //             });
                //         }
                //     }
                // }
            }
        });
                    
    });
};


                                   
  
  exports.handler = async (event) => {
    const blockName = event.blockName;
    const showName = event.showName;
    const startRow = event.startRow;
    const endRow = event.endRow;
    const startCol = event.startCol;
    const endCol = event.endCol;
    const price = event.price;
    const section = event.section;
  
    try {
        const showID = await queryDatabase(showName) ;
        let i ;
        let j ;
        for (i = startRow; i <= endRow; i++){
            for (j = startCol; j <= endCol; j++){
              const success = await another(showID, i, j, blockName, price, section) ;
              console.log(success);
            }
        }
        
        //console.log(response);
        return {
            statusCode: 200, 
            body: "Blocks created"
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500, 
            body: 'Internal Server Error'
        };
    }
  };