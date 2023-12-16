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
export async function handlecreateVenue(venueName, totalSeats, username, password, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight) {
    try {
        // Assuming handleRegister needs a username and password
        const registrationSuccess = await handleRegister(username, password);
                
        if (registrationSuccess && registrationSuccess) {
            console.log('User registered successfully. Proceeding to create venue.');
            const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/createVenue', {
            "venueName": venueName,
            "totalSeats": totalSeats,
            "username" : username,
            "rowLeft" : rowLeft,
            "colLeft" : colLeft,
            "rowCenter" : rowCenter,
            "colCenter" : colCenter,
            "rowRight" : rowRight,
            "colRight" : colRight
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

//Function that handles retrieving all seats
export async function listSectionSeats(showID, section) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listSectionSeats", {
            "showID" : showID, 
            "section" : section,
        });

        if (response.data.statusCode === 200) {
            return response.data.body;

        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body
            }));
        }
    } catch (error) {
        console.error('Retrieving Seats Error: ', error);
    }
}


//Function that handles retrieving all seats
export async function listAvailableSeats(showID) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listAllSeats", {
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return response.data.body;

        } else {
            console.log(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body
            }));
        }
    } catch (error) {
        console.error('Retrieving Seats Error: ', error);
    }
}

//Function that handles purchasing seats and returning seats if applicable
export async function purchaseSeats(showID, seats) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/purchaseSeats", {
            "showID" : showID, 
            "seats" : seats
        });

        if (response.data.statusCode === 200) {
            return [];
        } else if (response.data.statusCode === 201) {
            return response.data.body;
        } else {
            console.error(JSON.stringify({
                statusCode: response.data.statusCode, 
                body: response.data.body
            }));
        }
    } catch (error) {
        console.error("Purchase Error: ", error);
    }
}

//listShowsForVenue function
export async function listShowsForVenue(venueID) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listShowsForVenue', {
            "venueID" : venueID
        });
        
        if (response.data.statusCode === 200) {
            const shows = JSON.parse(response.data.body);
            return shows;

        } else {
            console.error("Error fetching shows:", {
                statusCode: response.data.statusCode,
                body: response.data.body
            });
        }
    } catch (error) {
        console.error("Error fetching venues:", error);
        return []; // Return an empty array in case of an error
    }
}


//Function that handles deletingShows for Admin
export async function deleteShowAdmin(showID) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/deleteShowAdmin", {
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return response.data.statusCode;
        } else {
            return response.data.statusCode;
        }
    } catch (error) {
        console.error("Error Deleting Shows", error);
    }
}


//Function that handles creating Tickets
export async function createTickets(showID, section, rows, columns) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/createTickets", {
            "showID" : showID, 
            "section" : section, 
            "numRows" : rows, 
            "numColumns" : columns
        });
        console.log(response);

        if (response.data.statusCode === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error("Could not create tickets: ", error);
    }
}

//Function that handles activating a show. 
export async function activateShow(showID, rowLeft, colLeft, rowCenter, colCenter, rowRight, colRight) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/activateShow", {
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            const ticketCreationLeft = await createTickets(showID, "Left", rowLeft, colLeft);
            console.log("Ticket Creation Left: ", ticketCreationLeft);
            const ticketCreationCenter = await createTickets(showID, "Center", rowCenter, colCenter);
            console.log("Ticket Creation Center: ", ticketCreationCenter);
            const ticketCreationRight = await createTickets(showID, "Right", rowRight, colRight);
            console.log("Ticket Creation Right: ", ticketCreationRight);

            if (ticketCreationLeft && ticketCreationCenter && ticketCreationRight) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    } catch (error) {
        console.log("Error: ", error);
    }
}


//Function Responsible for deletion of shows.
export async function deleteShowVM(showID) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/deleteShowVM',{
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return true;
        } else {
            console.error("Error fetching shows:", {
                statusCode: response.data.statusCode,
                body: response.data.body
            });
        }
    } catch (error) {
        console.error("Error fetching shows:", error);
    }
}


//Function for helping to generate Show Reports
export async function showReport(showID) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/generateShowReport", {
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return response.data.body;
        } else {
            return [];
        }
        
    } catch (error) {
        console.error("Error generating show report: ", error);
    }
}

//Function for checking the showStatus
export async function showStatus(showID) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/checkShowStatus",{
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return response.data.body; 
        } else {
            return 1;
        }
    } catch (error) {
        console.error("Error in checking the status: ", error);
    }
}


//Function responsible for creatingBlocks
export async function createBlockForShow(showID, blockName, startRow, endRow, startCol, endCol, price, section) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/createBlock", {
            "showID" : showID, 
            "blockName": blockName,
            "startRow": startRow,
            "endRow": endRow,
            "startCol": startCol,
            "endCol": endCol,
            "price": price,
            "section": section
        });

        console.log(response);

        if (response.data.statusCode === 200) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error in checking the status: ", error);
    }
}

//Function responsible for listing Blocks
export async function listBlockForShows(showID) {
    try {
        const response = await Axios.post("https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/listBlocksForShow", {
            "showID" : showID
        });

        if (response.data.statusCode === 200) {
            return JSON.parse(response.data.body);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error in listing blocks: ", error);
    }
}


//Function responsible for Delete Block 
export async function deleteBlock(showID, blockName) {
    try {
        const response = await Axios.post('https://j1e9gw8669.execute-api.us-east-1.amazonaws.com/Initial/deleteBlock', {
            "showID" : showID,
            "blockName": blockName
        });

        if (response.data.statusCode === 200) {
            return response.data.body;
        } else {
            console.error("Error deleting blocks:", {
                statusCode: response.data.statusCode,
                body: response.data.body
            });
        }
    } catch (error) {
        console.error("Error deleting blocks:", error);
    }
}