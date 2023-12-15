import './showDetails.css'
import React from 'react';
import { useParams } from 'react-router-dom';
import { listSectionSeats, listAvailableSeats, purchaseSeats, showStatus } from '../Controller/Controller';
import LoadingSpinner from './LoadingSpinner.js';


export const ShowDetails = () => {
const { showID } = useParams();
const [selectedSeats, setSelectedSeats] = React.useState([]);
const [seatsLeft, setSeatsLeft] = React.useState([]);
const [seatsCenter, setSeatsCenter] = React.useState([]);
const [seatsRight, setSeatsRight] = React.useState([]);
const [allSeats, setAllSeats] = React.useState([]);
const [timerVisible, setTimerVisible] = React.useState(false);
const [timerDuration, setTimerDuration] = React.useState(300); // 5 minutes in seconds
const [purchaseButton, setPurchaseButton] = React.useState(true);
const [timerExpired, setTimerExpired] = React.useState(false);
const [loading, setLoading] = React.useState(true);

//Function to start the timer
const startTimer = () => {
    setTimerVisible(true);
};

// Function to reset the timer
const resetTimer = () => {
    setTimerVisible(false);
    setTimerDuration(300);
};


//Use Effect to decrement the timer. 
React.useEffect(() => {
    let timer;

    if (timerVisible && timerDuration > 0) {
        timer = setInterval(() => {
            setTimerDuration((prevDuration) => prevDuration - 1);
        }, 1000);
    }

    // Cleanup function
    return () => clearInterval(timer);
}, [timerVisible, timerDuration]);

//Use Effect to check if the timer has expired. 
React.useEffect(() => {
    if (timerDuration === 0) {
        setTimerExpired(true);
    }
}, [timerDuration]);

const handleSeatClick = (section, row, column) => {
  // Check if the seat is already selected
  const isSeatSelected = selectedSeats.some(
    seat => seat.section === section && seat.row === row && seat.column === column
  );

  // If the seat is selected, remove it; otherwise, add it to the selection
  if (isSeatSelected) {
    setSelectedSeats(prevSeats =>
      prevSeats.filter(
        seat => !(seat.section === section && seat.row === row && seat.column === column)
      )
    );

  } else {
    setSelectedSeats(prevSeats => [
      ...prevSeats,
      { section, row, column }
    ]);

    startTimer();

  }
};

React.useEffect(() => {
    const fetchSeats = async() => {
        try {
            setLoading(true);
            const currentShowStatus = await showStatus(showID);
            console.log(currentShowStatus[0]);

            if (currentShowStatus[0].isActivated === 0) {
                window.location.href = '/showHasBegun';
            } else {
                const seatsLeft = await listSectionSeats(showID, "Left");
                const seatsCenter = await listSectionSeats(showID, "Center");
                const seatsRight = await listSectionSeats(showID, "Right");
                const parsedSeatsLeft = JSON.parse(seatsLeft);
                const parsedSeatsCenter = JSON.parse(seatsCenter);
                const parsedSeatsRight = JSON.parse(seatsRight);
                
                setSeatsLeft([parsedSeatsLeft[0].numRows, parsedSeatsLeft[0].numCols]);
                setSeatsCenter([parsedSeatsCenter[0].numRows, parsedSeatsCenter[0].numCols]);
                setSeatsRight([parsedSeatsRight[0].numRows, parsedSeatsRight[0].numCols]);
    
                const availableSeats = await listAvailableSeats(showID);
                const parsedSeats = JSON.parse(availableSeats);
    
                setAllSeats(parsedSeats);
            }
        } 
        catch (error) {
            console.error("Error fetching shows:", error);
        } finally {
            setLoading(false);
        }
    }

    fetchSeats();
}, [showID]);


const confirmPurchaseHandler = async () => {
    try {
        const currentShowStatus = await showStatus(showID);

        if (currentShowStatus[0].isActivated === 0) {
            window.location.href = '/showHasBegun';
        } else {
            const result = await purchaseSeats(showID, selectedSeats);
            console.log(result);
            
            if (result.length === 0) {
                console.log("Purchase Successfull");
                resetTimer();
                window.location.href = "/purchased";
                
            } else {
                //Handle Logic for reloading the seat selection graphic
                setPurchaseButton(false);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const handleTryAgain = () => {
    window.location.reload();
}

const goHome = () => {
    window.location.href = "/";
}

// Function to calculate the total price of selected seats
const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
        const matchingSeat = allSeats.find(
        (s) =>
            s.section === seat.section &&
            s.seatRow === seat.row &&
            s.seatCol === seat.column
        );
        return total + (matchingSeat ? matchingSeat.seatPrice : 0);
    }, 0);
};

return (
    <main>
        <div>
            <div className = "navBar">
                <p className = "loginTrigger" onClick={goHome}> Home </p>
                <p className = "no-hover"> Seats4You </p>
            </div>
        { loading ? (
            <div className="loadingContainer">
                <LoadingSpinner/>
            </div>) : (
        
        <div className="venue">
            <div className="section" id="left">
            <h2>Left</h2>
            {/* Render seats dynamically based on the venue structure */}
            {Array.from({ length: seatsLeft[0] }, (_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="seat-row">
                {Array.from({ length: seatsLeft[1] }, (_, colIndex) => {
                    const seatNumber = rowIndex * seatsLeft[1] + colIndex + 1;
                    const currentRow = rowIndex + 1;
                    const currentColumn = colIndex + 1;
                    const isSeatSold = allSeats.some(
                    seat =>
                        seat.section === 'Left' &&
                        seat.seatRow === rowIndex + 1 &&
                        seat.seatCol === colIndex + 1 &&
                        seat.isSold === 1
                    );

                    // Find the corresponding seat in allSeats array
                    const seat = allSeats.find(
                        seat =>
                            seat.section === 'Left' &&
                            seat.seatRow === currentRow &&
                            seat.seatCol === currentColumn
                    );

                    return (
                        <div
                            key={`left-${seatNumber}`}
                            className={`seat ${
                                selectedSeats.some(
                                seat => seat.section === 'Left' && seat.row === rowIndex + 1 && seat.column === colIndex + 1)
                                ? 'selected'
                                : isSeatSold
                                ? 'sold'
                                : (seat && seat.seatPrice < 20)
                                ? 'low'
                                : (seat && seat.seatPrice < 55)
                                ? 'mid' 
                                : 'high'
                            }`}
                            onClick={() => !isSeatSold && handleSeatClick('Left', rowIndex + 1, colIndex + 1)}
                        >
                            {`${currentRow}-${currentColumn}`}
                        </div>
                    );
                })}
                </div>
            ))}
            </div>


            <div className="section" id="center">
                <h2>Center</h2>
                {/* Render seats dynamically based on the venue structure */}
                {Array.from({ length: seatsCenter[0] }, (_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="seat-row">
                    {Array.from({ length: seatsCenter[1] }, (_, colIndex) => {
                        const seatNumber = rowIndex * seatsCenter[1] + colIndex + 1;
                        const isSeatSold = allSeats.some(
                            seat =>
                                seat.section === 'Center' &&
                                seat.seatRow === rowIndex + 1 &&
                                seat.seatCol === colIndex + 1 &&
                                seat.isSold === 1
                            );

                        // Find the corresponding seat in allSeats array
                        const seat = allSeats.find(
                            seat =>
                                seat.section === 'Center' &&
                                seat.seatRow === rowIndex + 1 &&
                                seat.seatCol === colIndex + 1
                        );

                        return (
                            <div
                                key={`center-${seatNumber}`}
                                className={`seat ${
                                    selectedSeats.some(
                                    seat => seat.section === 'Center' && seat.row === rowIndex + 1 && seat.column === colIndex + 1)
                                    ? 'selected'
                                    : isSeatSold
                                    ? 'sold'
                                    : (seat && seat.seatPrice < 20)
                                    ? 'low'
                                    : (seat && seat.seatPrice < 55)
                                    ? 'mid' 
                                    : 'high'
                                }`}
                                onClick={() => !isSeatSold && handleSeatClick('Center', rowIndex + 1, colIndex + 1)}
                            >
                                {`${ rowIndex + 1}-${colIndex + 1}`}
                            </div>
                        );
                    })}
                    </div>
                ))}

                {allSeats.length > 0 && (
                        <div className="containerMenu">
                            <div className="containerMock">

                                <div className="selected-seats-container">
                                    <h2>Selected Seats</h2>
                                    <ul>
                                    {selectedSeats.map((seat) => {
                                        const matchingSeat = allSeats.find(
                                        (s) =>
                                            s.section === seat.section &&
                                            s.seatRow === seat.row &&
                                            s.seatCol === seat.column
                                        );

                                        return (
                                        <li key={`${seat.section}-${seat.row}-${seat.column}`}>
                                            {`${seat.section} - ${seat.row}-${seat.column}: ${
                                            matchingSeat ? `$${matchingSeat.seatPrice.toFixed(2)}` : 'N/A'
                                            }`}
                                        </li>
                                        );
                                    })}
                                    </ul>
                                </div>

                                <p>Total: ${calculateTotalPrice().toFixed(2)}</p>

                            </div>
                        </div>
                )}

                <div className="confirm-purchase">
                    {purchaseButton && !timerExpired ? (<button disabled={selectedSeats.length === 0} onClick={confirmPurchaseHandler}> Confirm Purchase </button>) :
                                      (<button className="another-button" onClick={handleTryAgain}> Purchase Failed Try Again </button>) }
                </div>
            

                {timerVisible && (
                    <div className="timer">
                            Timer: {Math.floor(timerDuration / 60).toLocaleString('en-US', {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false,
                                })}
                                :{String(timerDuration % 60).padStart(2, '0')}
                    </div>
                )}
            </div>

            <div className="section" id="right">
                <h2>Right</h2>
                {/* Render seats dynamically based on the venue structure */}
                {Array.from({ length: seatsRight[0] }, (_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="seat-row">
                    {Array.from({ length: seatsRight[1] }, (_, colIndex) => {
                        const seatNumber = rowIndex * seatsRight[1] + colIndex + 1;
                        const isSeatSold = allSeats.some(
                            seat =>
                                seat.section === 'Right' &&
                                seat.seatRow === rowIndex + 1 &&
                                seat.seatCol === colIndex + 1 &&
                                seat.isSold === 1
                            );

                        // Find the corresponding seat in allSeats array
                        const seat = allSeats.find(
                            seat =>
                                seat.section === 'Right' &&
                                seat.seatRow === rowIndex + 1 &&
                                seat.seatCol === colIndex + 1
                        );

                        return (
                            <div
                                key={`right-${seatNumber}`}
                                className={`seat ${
                                    selectedSeats.some(
                                    seat => seat.section === 'Right' && seat.row === rowIndex + 1 && seat.column === colIndex + 1)
                                    ? 'selected'
                                    : isSeatSold
                                    ? 'sold'
                                    : (seat && seat.seatPrice < 20)
                                    ? 'low'
                                    : (seat && seat.seatPrice < 55)
                                    ? 'mid' 
                                    : 'high'
                                }`}
                                onClick={() => !isSeatSold && handleSeatClick('Right', rowIndex + 1, colIndex + 1)}
                            >
                                {`${ rowIndex + 1}-${colIndex + 1}`}
                            </div>
                        );
                    })}
                    </div>
                ))}
            </div>
        </div> )}
        </div>
    </main>
    );
}

export default ShowDetails;