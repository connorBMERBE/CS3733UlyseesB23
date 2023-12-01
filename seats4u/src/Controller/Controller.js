import Axios from "axios";

//Function responsible for Logging in
export async function login(username, password) {
        Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/login', {
            'username' : username, 
            'password' : password, 

        }).then(function (response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log(response.data.body.token);
                const userToken = response.data.body.token;
                const userRole = response.data.body.role;

                //Store the token in local storage.
                localStorage.setItem('token', userToken);
                localStorage.setItem('role', userRole);

                console.log("DONE TOKEN ADDED");
            } else {
                console.log(JSON.stringify({
                    statusCode: response.data.statusCode, 
                    body: response.data.body}));
            }
            
        }).catch(function (error) {
            //Handle Login failure.
            console.log('Authenticaion Error: ', JSON.stringify({
                statusCode: 400, 
                body: "Invalid Credentials"}));
        });
}

//Function responsible for making show
export async function makeShow(username, showName, date, time, venueName) {
    Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/login', {
        'showName' : showName,
        'date' : date,
        'time' : time,
        'venuName' : venueName,


    }).then(function (response) {
        console.log(response);
        if (response.data.statusCode === 200) {
            console.log(response.data.body.token);
            const userToken = response.data.body.token;
            const userRole = response.data.body.role;

            //Store the token in local storage.
            localStorage.setItem('token', userToken);
            localStorage.setItem('role', userRole);

            console.log("DONE TOKEN ADDED");
        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body}));
        }
        
    }).catch(function (error) {
        //Handle Login failure.
        console.log('Authenticaion Error: ', JSON.stringify({
            statusCode: 400, 
            body: "Invalid Credentials"}));
    });
}


