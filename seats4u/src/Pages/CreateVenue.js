// export default CreateVenue;
import React from 'react';
import './CreateVenue.css';
import { login, handlecreateVenue } from '../Controller/Controller.js';

export const CreateVenue = () => {
  const [venueName, setVenueName] = React.useState('');
  const [rcleft, setrcleft] = React.useState('');
  const [rccenter, setrccenter] = React.useState('');
  const [rcright, setrcright] = React.useState('');
  const [username, setusername] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [totalSeats, settotalSeats] = React.useState(0);

  const calculateSeats = (input, section) => {
    if (!input) return 0; // Handle empty input
    const [rows, columns] = input.split(',').map(Number);
    return rows * columns;
  };

  const seatRowCol = (input) => {
    if (!input) return 0; // Handle empty input
    const [rows, columns] = input.split(',').map(Number);
    return [rows, columns];
  }

 

  const handleseatsData = async (event) => {
    event.preventDefault();

    // Calculating the number of seats for each section
    const seatsLeft = calculateSeats(rcleft, "Left");
    const seatsCenter = calculateSeats(rccenter, "Center");
    const seatsRight = calculateSeats(rcright, "Right");

    const left = seatRowCol(rcleft);
    const center = seatRowCol(rccenter);
    const right = seatRowCol(rcright);

    console.log(left[0], left[1], center[0], center[1], right[0], right[1]); 


    // Summing up the total number of seats
    const calculatedTotalSeats = seatsLeft + seatsCenter + seatsRight;
    settotalSeats(calculatedTotalSeats); // Update the state

    try {
      // Call handlecreateVenue with the collected data
      await handlecreateVenue(venueName, calculatedTotalSeats, username, password, left[0], left[1], center[0], center[1], right[0], right[1]);
      // Additional logic for successful venue creation
      console.log("Venue creation successful");
      
      await login(username, password);

      window.location.href = "/vmDashboard";

    } catch (error) {
      console.error('Error in creating venue:', error);
      // Handle errors
    }
  };

  return (
    <main>
      <h1> Create Venue </h1>

      <form onSubmit={handleseatsData}>
        <div className="stack">
          <label>Venue Name </label>
          <input type="text" placeholder="Venue Name" onChange={(e) => setVenueName(e.target.value)} required />
          <label>Left:</label>
          <input type="text" placeholder="rows, columns" onChange={(e) => setrcleft(e.target.value)} required />
          <label>Center:</label>
          <input type="text" placeholder="rows, columns" onChange={(e) => setrccenter(e.target.value)} required />
          <label>Right:</label>
          <input type="text" placeholder="rows, columns" onChange={(e) => setrcright(e.target.value)} required />
          <label>Username:</label>
          <input type="text" placeholder="Username" onChange={(e) => setusername(e.target.value)} required />
          <label>Password:</label>
          <input type="password" placeholder="Password" onChange={(e) => setpassword(e.target.value)} required />
          <label>Total seats: {totalSeats}</label>
          <button type="submit"> Create Venue </button>
        </div>
      </form>
    </main>
  );
};

export default CreateVenue;