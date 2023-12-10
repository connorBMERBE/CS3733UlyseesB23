import './createShow.css';
import React from 'react';
import {parseJwt, createShow} from '../Controller/Controller.js';



export const CreateShow = (e) => {
    const [showName, setShowName] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const handleCreateShow = async (e) =>{
        e.preventDefault();
        try {
            const username = parseJwt(localStorage.getItem('token')).userID;

            // Parse date and time strings
            const [month, day, year] = date.split('/');
            const [hours, minutes] = time.slice(0, -2).split(':');
            const ampm = time.slice(-2);

            // Adjust hours for PM
            const adjustedHours = ampm === 'PM' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

            // Create Date object with parsed values
            const jsDateTime = new Date(year, month - 1, day, adjustedHours, minutes);

            // Format date for MySQL
            const formattedDateTime = formatDateTime(jsDateTime);

            console.log(formattedDateTime);

            const response = await createShow(username, showName, formattedDateTime, time, price);

            if (response.data.statusCode === 200) {
                setSuccessMessage("Show created successfully!");
                setTimeout(() => {
                    window.location.reload();
                  }, 3000); 
            } else {
                setErrorMessage("Could not create the show");
            }

        } catch (error) {
            console.log(error);
            setErrorMessage("Could not create the show");
        }
    }

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    
        window.location.href = "/";
    }

    const backToDashHandler = () => {
        window.location.href = "/vmDashboard";
    }
    
    return(
        <main>
            <div>

            <div className = "navBar">
                <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                <p className = "loginTrigger" onClick = {backToDashHandler}> Back to Dashboard</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <h1>
                Create Show
            </h1>

            <form onSubmit = {handleCreateShow}>
                <div className = "stack">
                <label>Show Name</label>
                <input type="text" placeholder="showName" onChange={(e) => setShowName(e.target.value)} required/>
                <label>Date (One show per day) </label>
                <input type="text" placeholder="mm/dd/yyyy" onChange={(e) => setDate(e.target.value)} required/>
                <label>Time</label>
                <input type="text" placeholder="hh:mm" onChange={(e) => setTime(e.target.value)} required/>
                <label>Base Price</label>
                <input type="text" placeholder="$-" onChange={(e) => setPrice(e.target.value)} required/>
                <button type="submit"> Create Show </button>
                </div>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            </div>
        </main>
    )
}

export default CreateShow

