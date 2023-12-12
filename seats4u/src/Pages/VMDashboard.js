import './VMDashboard.css';
import React from 'react';
import { parseJwt, listVenue, deleteVenue, listShowsForVenue, activateShow, deleteShowVM} from '../Controller/Controller.js';

export const VMDashboard = () => {
    const [venue, setVenue] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [createShowButton, setCreateShowButton] = React.useState(true);
    const [shows, setShows] = React.useState([]);
    const [selectedShow, setSelectedShow] = React.useState(null);
    const [activatedShow, setActiveShow] = React.useState(null);
    const [activationFailure, setaActivationFailure] = React.useState(false);
    const [deletionFailure, setDeletionFailure] = React.useState(false);

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

    React.useEffect(() => {
        async function fetchShowsForVenue() {
            try {
                const response = await listShowsForVenue(venue[0].venueID);
                if (response.length > 0) {
                    const sorted = response.sort((a, b) => {
                        const dateA = new Date(a.Date).toISOString(); //Ensures that dates are in a consistent format
                        const dateB = new Date(b.Date).toISOString();
                        return dateB.localeCompare(dateA); // Sort in descending order (most recent first)
                    });
                    setShows(sorted);
                } else {
                    setShows([]);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchShowsForVenue();
    }, [venue]);

    const deleteVenueHandler = async () => {
        try {
            const username = parseJwt(localStorage.getItem('token')).userID;
            await deleteVenue(username);
            setVenue([]);
            setCreateShowButton(false);

            setTimeout(() => {
                // Perform the action you want after the timeout (e.g., redirect)
                logoutHandler();
              }, 3000);
        } catch (error) {
            console.error(error);
        }
    }

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    
        window.location.href = "/";
    }

    const toCreateVenue = () => {
        window.location.href = "/vmDashboard/createShow";
    }

    const handleShowDeletion = async () => {
        try {
            const response = await deleteShowVM(activatedShow.showID);

            if (response) {
                window.location.reload();
            } else {
                setDeletionFailure(true);
            }
        } catch (error) {
            console.error("System Error in Deletion: ", error);
        }

    }

    const handleActivationShowSelection = (show) => {
        if(activatedShow) {
            setActiveShow(null);
        } else {
            setActiveShow(show);
        }
    }

    const handleActivateShow = async () => {
        console.log(venue);
        console.log(activatedShow.showID, venue[0].rowLeft, venue[0].colLeft, venue[0].rowCenter, venue[0].colCenter, venue[0].rowRight, venue[0].colRight);
        const response = await activateShow(activatedShow.showID, venue[0].rowLeft, venue[0].colLeft, venue[0].rowCenter, venue[0].colCenter, venue[0].rowRight, venue[0].colRight);
        console.log(response);
        try {
            if (response) {
                window.location.reload();
            } else {
                setaActivationFailure(true);
            }
        } catch (error) {
            setaActivationFailure(true);
        }
    }

    return(
        <main>
            <div className = "navBar">
                <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <h1 className="welcomeMessage"> Welcome to your Dashboard, {parseJwt(localStorage.getItem('token')).userID}!</h1>

            <div className="menuContainer">
                <div className = "dashboardContainer">
                    <h1 className = "VMVenueLabel">  Your Venue </h1>
                        <div className = "vmDashboardMenu" id="venueMenu">
                            {loading ? (
                                <span>Loading...</span>
                                ) : venue.length > 0 ? (
                                venue.map((venue, index) => (
                                    <span key={index}>{venue.venueName}</span>
                                ))
                                ) : (
                                <span>No Venues Present</span>
                                )}
                    </div>
                    <button className="deleteButton" onClick={deleteVenueHandler}><span>Purge Venue</span></button>
                    {createShowButton && (
                        <button className="createShowButton" onClick={toCreateVenue}>
                            <span>Create Show</span>
                        </button>
                        )}
                </div>

                <div className = "dashboardContainer">
                        <h1 className = "VMVenueLabel">Inactive Shows</h1>
                        <div className = "vmDashboardMenu" id="venueMenu">
                            {loading ? (
                                <span>Loading...</span>
                                ) : shows.filter((show) => show.isActivated === 0).length > 0 ? (
                                    shows
                                    .filter((show) => show.isActivated === 0)
                                    .map((show, index) => (
                                    <span key={index} id="inactive" className={activatedShow && activatedShow.showID === show.showID ? 'activateShowSpan' : ''}
                                          onClick={() => handleActivationShowSelection(show)}>{show.showName} - {new Date(show.showDate).toLocaleDateString('en-US', 
                                    {
                                       year: '2-digit', 
                                       month: '2-digit', 
                                       day: '2-digit',
                                       timeZone: 'UTC'
                                    })}</span>
                                ))
                                ) : (
                                <span>No Shows Present</span>
                                )}
                        </div>
                        <button className="activateShow" onClick={() => handleActivateShow()} disabled={activatedShow === null}><span disabled={activatedShow === null}>Activate Show</span></button>
                        <button className="deleteShow" onClick={() => handleShowDeletion()} disabled={activatedShow === null}><span>Delete Show</span></button>
                        {activationFailure ? 
                            (<div className = "failure">Could not activate show</div>) : deletionFailure ? 
                            (<div className = "failure">Could not delete show</div>) : null}
                </div>
                
            </div>

            <div className="inactiveContainer">
                <div className = "dashboardContainer">
                <h1 className = "VMVenueLabel">Active Shows</h1>
                        <div className = "vmDashboardMenu" id="venueMenu">
                            {loading ? (
                                <span>Loading...</span>
                                ) : shows.filter((show) => show.isActivated === 1).length > 0 ? (
                                    shows
                                    .filter((show) => show.isActivated === 1)
                                    .map((show, index) => (
                                    <span key={index} className={selectedShow && selectedShow.showID === show.showID ? 'selectedShow' : ''}>
                                        {show.showName} - {new Date(show.showDate).toLocaleDateString('en-US', 
                                    {
                                       year: '2-digit', 
                                       month: '2-digit', 
                                       day: '2-digit',
                                       timeZone: 'UTC'
                                    })}</span>
                                ))
                                ) : (
                                <span>No Shows Present</span>
                                )}
                        </div>
                </div>
            </div>
        </main>
    );
}

export default VMDashboard;