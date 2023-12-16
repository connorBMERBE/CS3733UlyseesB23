import './adminPage.css';
import React from 'react';
import { parseJwt, listVenues, listShowsForVenue, deleteShowAdmin, showReport } from '../Controller/Controller.js';

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

    // Define ShowReportComponent directly within AdminPage
    const ShowReportComponent = ({ showID }) => {
        const [report, setReport] = React.useState(null);

        React.useEffect(() => {
            const fetchReport = async () => {
                try {
                    const fetchedReports = await showReport(showID);
                    setReport(JSON.parse(fetchedReports));
                } catch (error) {
                    console.error("Error fetching report:", error);
                }
            };

            fetchReport();
        }, [showID]);

        return (
            <div>
                {report ? (
                    <div>
                        {report.totalSeats !== 0 ? (
                            <div>
                                <p>Proceeds: ${report.sumSoldSeatsValue}</p>
                                <p>Seats Sold: {report.soldSeats}/{report.totalSeats}</p>
                            </div>
                        ) : (
                            <p>Show is Inactive</p>
                        )}
                    </div>
                ) : (
                    <p>Loading report...</p>
                )}
            </div>
        );
    };
    return(
        <main>
            <div className = "navBar">
                <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                <p className = "no-hover"> Seats4You </p>
            </div>
            <h1 className="welcomeMessage"> Welcome to your Administrator Dashboard, {parseJwt(localStorage.getItem('token')).userID}!</h1>

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
                    <h1 className="listVenueLabel"> Delete Shows Menu </h1>
                    <div className="verticalMenu" id="venueMenu2">
                        {loadingShows ? (
                            <span className = "noShows">Loading...</span>
                        ) : shows.length > 0 ? (
                            shows.map((show, index) => (
                                <span className="blockItems" key={index} onClick={() => handleDeletion(show.showID)}>
                                    <p>{show.showName} - {new Date(show.showDate).toLocaleDateString('en-US', 
                                        {   year: '2-digit', 
                                            month: '2-digit', 
                                            day: '2-digit',
                                            timeZone: 'UTC' })}
                                    </p>
                                    <ShowReportComponent showID={show.showID} />
                                </span>
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