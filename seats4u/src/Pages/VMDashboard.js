import './VMDashboard.css';
import React from 'react';
import { parseJwt, listVenue, deleteVenue, activateShow } from '../Controller/Controller.js';

export const VMDashboard = () => {
    const [venue, setVenue] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [createShowButton, setCreateShowButton] = React.useState(true);

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

    const activateShowHandler = () => {
        try{
            //stub const rn make sure we change this after we have the ability to select a show
            const showID = 23;
            activateShows(showID);
        }catch (error) {
            console.log(error);
        }
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
                <button className="deleteButton" onClick={deleteVenueHandler}><span>Purge Venue</span></button>
                <button className="activateButton" onClick={activateShowHandler}><span>Activate Show</span></button>
                {createShowButton && (
                    <button className="createShowButton" onClick={toCreateVenue}>
                        <span>Create Show</span>
                    </button>
                    )}
            </div>
        </main>
    );
}

export default VMDashboard;