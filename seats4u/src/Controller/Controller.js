import Axios from "axios";

//Function responsible for Venue Manager Logging in
export async function login(username, password) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/login', {
            'username' : username, 
            'password' : password, 

        });
        
        if (response.data.statusCode === 200) {
            const userToken = response.data.body.token;
            const userRole = response.data.body.role;

            //Store the token in local storage.
            localStorage.setItem('token', userToken);
            localStorage.setItem('role', userRole);

            console.log("DONE TOKEN ADDED");

            window.location.href = '/vmDashboard'
        } else {
            console.error(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body}));

            return false;
        }
    } catch (error) {
        //Handle Other Login failure.
        console.error("Login Error: ", error.message);
    }
}

//Function responsible for AdminLogin
/*
export async function adminLogin(username, password) {
    Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/adminLogin', {
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

            window.location.href = '/adminPage'
        } else {
            console.error(JSON.stringify({
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
*/
export async function adminLogin(username, password) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/adminLogin', {
            'username' : username, 
            'password' : password, 

        });
        
        if (response.data.statusCode === 200) {
            const userToken = response.data.body.token;
            const userRole = response.data.body.role;

            //Store the token in local storage.
            localStorage.setItem('token', userToken);
            localStorage.setItem('role', userRole);

            console.log("DONE TOKEN ADDED");

            window.location.href = '/adminPage'
        } else {
            console.error(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body}));

            return false;
        }
    } catch (error) {
        //Handle Other Login failure.
        console.error("Login Error: ", error.message);
    }
}

// Modified listVenues function
export async function listVenues() {
    try {
        const response = await Axios.get('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listVenues');
        
        if (response.data.statusCode === 200) {
            const venues = JSON.parse(response.data.body);
            return venues;
        } else {
            console.error("Error fetching venues:", {
                statusCode: response.data.statusCode,
                body: response.data.body
            });
        }
    } catch (error) {
        console.error("Error fetching venues:", error);
        return []; // Return an empty array in case of an error
    }
}

// Modified listVenues function
export async function listVenue(username) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listVenue',{
            "username" : username,
        });
        
        if (response.data.statusCode === 200) {
            const venue = JSON.parse(response.data.body);
            console.log(venue);
            return venue;
        } else {
            console.error("Error fetching venues:", {
                statusCode: response.data.statusCode,
                body: response.data.body
            });
        }
    } catch (error) {
        console.error("Error fetching venues:", error);
    }
}

export function parseJwt(token) {
    // Step 1: Extract Payload
    const base64Url = token.split('.')[1];
    
    // Step 2: Base64 Decoding
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    
    // Step 3: JSON Parsing
    return JSON.parse(jsonPayload);
}