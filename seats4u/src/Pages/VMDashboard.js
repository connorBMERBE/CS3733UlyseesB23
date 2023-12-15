import './VMDashboard.css';
import React from 'react';
import { parseJwt, listVenue, deleteVenue, listShowsForVenue, activateShow, deleteShowVM, showReport} from '../Controller/Controller.js';

export const VMDashboard = () => {
    const [venue, setVenue] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [createShowButton, setCreateShowButton] = React.useState(true);
    const [shows, setShows] = React.useState([]);
    const [selectedShow, setSelectedShow] = React.useState(null);
    const [activatedShow, setActiveShow] = React.useState(null);
    const [activationFailure, setaActivationFailure] = React.useState(false);
    const [deletionFailure, setDeletionFailure] = React.useState(false);
    const [reportLoading, setReportLoading] = React.useState(false);
    const [report, setReport] = React.useState(null);
    const [showReportData, setShowReport] = React.useState(null);


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
                // Assuming a.Date and b.Date are DateTime objects
                const dateA = new Date(a.Date).getTime(); // Convert DateTime to milliseconds since epoch
                const dateB = new Date(b.Date).getTime();
                return dateB - dateA; // Sort in descending order (most recent first)
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
        const response = await activateShow(activatedShow.showID, venue[0].rowLeft, venue[0].colLeft, venue[0].rowCenter, venue[0].colCenter, venue[0].rowRight, venue[0].colRight);
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

    const handleShowReport = async (show) => {
        setReportLoading(true);
      
        try {
          if (showReportData && showReportData.showID === show.showID) {
            // If the same show is clicked again, reset the report data
            setShowReport(null);
            setReport(null);
          } else {
            // If a new show is clicked, set the show data
            setShowReport(show);
            const fetchedReport = await showReport(show.showID);
            setReport(JSON.parse(fetchedReport));
          }
        } catch (error) {
          console.error("Error fetching report:", error);
        } finally {
          setReportLoading(false);
        }
      };

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
                                    <span key={index} className={selectedShow && selectedShow.showID === show.showID ? 'selectedShow' : ''}
                                    onClick={()=>handleShowReport(show)}>
                                        {show.showName} - {new Date(show.showDate).toLocaleDateString('en-US', 
                                    {
                                       year: '2-digit', 
                                       month: '2-digit', 
                                       day: '2-digit',
                                       timeZone: 'UTC'
                                    })}
                                </span>
                                ))
                                ) : (
                                <span>No Shows Present</span>
                                )}
                        </div>

                        
                </div>

                <div className = "dashboardContainer">
                <h1 className = "VMVenueLabel">Shows Report</h1>
                        <div className = "vmDashboardMenu" id="venueMenu">
                            {reportLoading ? (
                                <span>Loading...</span>
                                ) : report ? (
                                    <div>
                                        <span> Proceeds: ${report.sumSoldSeatsValue} </span>
                                        <span> Seats Sold: {report.soldSeats}/{report.totalSeats} </span>
                                    </div>
                                ): (
                                <span>Select Show</span>
                                )}
                        </div>    
                </div>

            
            </div>
        </main>
    );
}

export default VMDashboard;