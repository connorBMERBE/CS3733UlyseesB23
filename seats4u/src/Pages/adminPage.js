import './adminPage.css';
import React from 'react';
import { listVenues, listShowsForVenue, deleteShowAdmin } from '../Controller/Controller.js';

export const AdminPage = () => {

    const [venues, setVenues] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedVenue, setSelectedVenue] = React.useState(null);
    const [loadingShows, setLoadingShows] = React.useState(false);
    const [shows, setShows] = React.useState([]);

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

    const handleVenueClick = (venue) => {
        setLoadingShows(true);
        if (selectedVenue && selectedVenue.venueID === venue.venueID) {
            // If the same venue is clicked again, reset to no shows
            setSelectedVenue(null);
            setShows([]);
        } else {
            setLoadingShows(true);
            setSelectedVenue(venue);
        }
    }

    React.useEffect(() => {
        async function fetchShows() {
            try {
                if (selectedVenue) {
                    console.log(selectedVenue.venueID);
                    const showsData = await listShowsForVenue(selectedVenue.venueID);
                    setShows(showsData);
                } else {
                    setShows([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingShows(false);
            }
        }

        fetchShows();
    }, [selectedVenue]);

    const handleDeletion = async (showID) => {
        try {
            const response = await deleteShowAdmin(showID);

            if (response === 200) {
                setLoading(true);
                const showsData = await listShowsForVenue(selectedVenue.venueID);
                setShows(showsData);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <main>
            <div className = "navBar">
                <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                <p className = "no-hover"> Seats4You </p>
            </div>
            <div className = "menuContainer">
                <div className = "venueContainer">
                    <h1 className = "listVenueLabel"> List of Venues </h1>
                    <div className = "verticalMenu" id="venueMenu">
                        {loading ? (
                            <span>Loading...</span>
                            ) : venues.length > 0 ? (
                            venues.map((venue, index) => (
                                <span key={index} onClick={() => handleVenueClick(venue)}>{venue.venueName}</span>
                            ))
                            ) : (
                            <span>No Venues Present</span>
                            )}
                    </div>
                </div>

                <div className="venueContainer">
                    <h1 className="listVenueLabel"> Shows </h1>
                    <div className="verticalMenu" id="venueMenu2">
                        {loadingShows ? (
                            <span className = "noShows">Loading...</span>
                        ) : shows.length > 0 ? (
                            shows.map((show, index) => (
                                <span key={index} onClick={() => handleDeletion(show.showID)}>{show.showName}</span>
                            ))
                        ) : (
                            <span className="noShows">No Shows Present</span>
                        )}
                    </div>
                </div>
            </div>
            
        </main>
    );
}

export default AdminPage;