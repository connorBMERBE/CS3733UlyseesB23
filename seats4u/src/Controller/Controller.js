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

export async function deleteVenue(username) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/deleteVenue',{
            "username" : username,
        });
        
        if (response.data.statusCode === 200) {
            return response.data.body;
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

export async function createShow(username, showName, date, time, price) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/createShow',{
            "username" : username,
            "showName" : showName, 
            "date": date, 
            "time" : time, 
            "price" : price
        });
        
        if (response.data.statusCode === 200) {
            return response;

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

export async function handleRegister(username, password) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/register',{
            'username': username,
            'password': password,
        
        });

        if (response) {
            return response;
        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body}));
        }
    } catch (error) {
        console.log('User already exists ', JSON.stringify({
            statusCode: 400, 
            body: "User already exists"}));
    }
}

// Define handlecreateVenue with necessary parameters
export async function handlecreateVenue(venueName, totalSeats, username, password) {
    try {
        // Assuming handleRegister needs a username and password
        const registrationSuccess = await handleRegister(username, password);
                
        if (registrationSuccess && registrationSuccess) {
            console.log('User registered successfully. Proceeding to create venue.');
            const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/createVenue', {
            "venueName": venueName,
            "totalSeats": totalSeats,
            "username" : username
            });

            if (response.data.statusCode === 200) {
                console.log("VENUE ADDED");
            } else {
                console.log(JSON.stringify({
                    statusCode: response.data.statusCode, 
                    body: response.data.body
                }));
            }
        } else {
            console.log('User registration failed. Venue creation aborted.');
        }
        } 
        catch (error) {
            console.error('Authentication Error: ', error);
        }
}

// Function that handles listing all Created Venues
export async function listActiveShows() {
    try {
        const response = await Axios.get("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listActiveShows");

        if (response.data.statusCode === 200) {
            console.log("VENUE ADDED");
            return response.data.body;
        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body
            }));
        }
    }
        catch (error) {
            console.error('Listing Shows Error: ', error);
        }
}


// Function that handles listing all Created Venues
export async function activateShows() {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/activateShow");

        if (response.data.statusCode === 200) {
            console.log("VENUE ADDED");
            return response.data.body;
        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body
            }));
        }
    }
        catch (error) {
            console.error('Listing Shows Error: ', error);
        }
}
