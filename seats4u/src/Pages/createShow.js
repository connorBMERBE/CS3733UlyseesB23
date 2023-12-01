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

    const handleCreateShow = async (e) =>{
        e.preventDefault();
        try {
            const username = parseJwt(localStorage.getItem('token')).userID;
            const jsDate = new Date(date);
            const formatedDate =  jsDate.toISOString().split('T')[0];
            const response = await createShow(username, showName, formatedDate, time, price);
            console.log(response);

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

