import './createShow.css';
import React from 'react';
import {makeShow} from '../Controller/Controller.js';



export const CreateShow = () => {
    const [showName, setShowName] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');

    const handleCreateShow = () =>{
        makeShow("usernameHolder", showName, date, time)
    }
    


    return(
        <main>
            <h1>
                Create Show
            </h1>

            <form onSubmit = {handleCreateShow}>
                <div className = "stack">
                <label>Show Name</label>
                <input type="text" placeholder="showName" onChange={(e) => setShowName(e.target.value)} required/>
                <label>Date</label>
                <input type="text" placeholder="mm/dd/yyyy" onChange={(e) => setDate(e.target.value)} required/>
                <label>Time</label>
                <input type="text" placeholder="hh:mm" onChange={(e) => setTime(e.target.value)} required/>
                <button type="submit"> Create Show </button>
                </div>
            </form>
        </main>
    )
}

export default CreateShow

