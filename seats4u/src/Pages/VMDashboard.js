import './VMDashboard.css';
import React from 'react';
import { parseJwt, listVenue } from '../Controller/Controller.js';

export const VMDashboard = () => {
    const [venue, setVenue] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function listVenueHandler() {
            try {
                const username = parseJwt(localStorage.getItem('token')).userID;
                const venuesData = await listVenue(username);
                setVenue(venuesData);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        listVenueHandler();
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    
        window.location.href = "/";
    }

    return(
        <main>
            <div className = "navBar">
                <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className = "dashboardContainer">
                <h1 className = "VMVenueLabel"> Welcome {parseJwt(localStorage.getItem('token')).userID} Your Venue </h1>
                <div className = "vmDashboardMenu" id="venueMenu">
                    {loading ? (
                        <span>Loading...</span>
                        ) : venue.length > 0 ? (
                        venue.map((venue, index) => (
                            <span key={index}>{venue}</span>
                        ))
                        ) : (
                        <span>No Venues Present</span>
                        )}
                </div>
                <button className="deleteButton"><span>Purge Venue</span></button>
                <button className="createShowButton"><span>Create Show</span></button>
            </div>
        </main>
    );
}

export default VMDashboard;