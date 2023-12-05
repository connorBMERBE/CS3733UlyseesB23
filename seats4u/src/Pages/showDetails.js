import './showDetails.css'
import React from 'react';
import { useParams } from 'react-router-dom';
import { listSectionSeats, listAvailableSeats, purchaseSeats } from '../Controller/Controller';


export const ShowDetails = () => {
const { showID } = useParams();
const [selectedSeats, setSelectedSeats] = React.useState([]);
const [seatsLeft, setSeatsLeft] = React.useState([]);
const [seatsCenter, setSeatsCenter] = React.useState([]);
const [seatsRight, setSeatsRight] = React.useState([]);
const [allSeats, setAllSeats] = React.useState([]);
const [timerVisible, setTimerVisible] = React.useState(false);
const [timerDuration, setTimerDuration] = React.useState(30); // 5 minutes in seconds
const [purchaseButton, setPurchaseButton] = React.useState(true);
const [timerExpired, setTimerExpired] = React.useState(false);

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
        catch (error) {
            console.error("Error fetching shows:", error);
        } finally {

        }
    }

    fetchSeats();
}, [showID]);


const confirmPurchaseHandler = async () => {
    try {
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

return (
    <main>
        <div>
            <div className = "navBar">
                <p className = "loginTrigger" onClick={goHome}> Home </p>
                <p className = "no-hover"> Seats4You </p>
            </div>
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

                    return (
                    <div
                        key={`left-${seatNumber}`}
                        className={`seat ${
                        selectedSeats.some(
                            seat => seat.section === 'left' && seat.seatNumber === seatNumber
                        ) && 'selected'
                        } ${isSeatSold ? 'sold' : ''}`}
                        onClick={() => !isSeatSold && handleSeatClick('left', currentRow, currentColumn)}
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
                        return (
                        <div
                            key={`center-${seatNumber}`}
                            className={`seat ${selectedSeats.some(
                            seat => seat.section === 'center' && seat.row === rowIndex + 1 && seat.column === colIndex + 1
                            ) && 'selected'}
                            ${isSeatSold ? 'sold' : ''}`}
                            onClick={() => !isSeatSold && handleSeatClick('center', rowIndex + 1, colIndex + 1)}
                        >
                            {`${rowIndex + 1}-${colIndex + 1}`}
                        </div>
                        );
                    })}
                    </div>
                ))}

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
                        return (
                        <div
                            key={`right-${seatNumber}`}
                            className={`seat ${selectedSeats.some(
                            seat => seat.section === 'right' && seat.row === rowIndex + 1 && seat.column === colIndex + 1
                            ) && 'selected'}
                            ${isSeatSold ? 'sold' : ''}`}
                            onClick={() => !isSeatSold && handleSeatClick('right', rowIndex + 1, colIndex + 1)}
                        >
                            {`${rowIndex + 1}-${colIndex + 1}`}
                        </div>
                        );
                    })}
                    </div>
                ))}
            </div>
        </div>
        </div>
    </main>
    );
}

export default ShowDetails;