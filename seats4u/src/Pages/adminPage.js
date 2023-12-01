import './adminPage.css';
import React from 'react';
import { listVenues } from '../Controller/Controller.js';

export const AdminPage = () => {

    const [venues, setVenues] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function listVenuesHandler() {
            try {
                const venuesData = await listVenues();
                setVenues(venuesData);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        listVenuesHandler();
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

            <div className = "venueContainer">
                <h1 className = "listVenueLabel"> List of Venues </h1>
                <div className = "verticalMenu" id="venueMenu">
                    {loading ? (
                        <span>Loading...</span>
                        ) : venues.length > 0 ? (
                        venues.map((venue, index) => (
                            <span key={index}>{venue}</span>
                        ))
                        ) : (
                        <span>No Venues Present</span>
                        )}
                </div>
            </div>
        </main>
    );
}

export default AdminPage;