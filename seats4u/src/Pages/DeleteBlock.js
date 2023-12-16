import React from 'react';
import { deleteBlock, listBlockForShows } from '../Controller/Controller';
import { Link, useParams } from 'react-router-dom';
import './createBlock.css';

//each block must have unique name, start row, end row, start col, end col, and price

export const DeleteBlock = (e) => {
    const [blockName, setBlockName] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [reportLoading, setReportLoading] = React.useState(false);
    const [blocks, setBlocks] = React.useState([]);
    const { showID } = useParams(); 

    const handleDeleteBlock = async (e) =>{
        e.preventDefault();
        try {
            const response = await deleteBlock(showID, blockName);
            console.log(response);

            if (response) {
                setSuccessMessage("Block deleted successfully!");
                window.location.reload();
            } else {
                setErrorMessage("Could not delete the Block");
            }

        } catch (error) {
            console.log(error);
            setErrorMessage("Could not delete the block");
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

    React.useEffect(() => {
        const retrieveBlocks = async() => {
            try {
                setReportLoading(true);
                const fetchedBlocks = await listBlockForShows(showID);
                const filteredBlocks = fetchedBlocks.blocks.filter(block => block.blockName !== 'Default');
                setBlocks(filteredBlocks);
                console.log(fetchedBlocks.blocks);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setReportLoading(false);
            }
        }

        retrieveBlocks();
    }, [showID]);
    
    return(
        <main>
            <div>
                <div className = "navBar">
                    <p className = "loginTrigger" onClick = {logoutHandler}> Logout</p>
                    <p className = "loginTrigger" onClick = {backToDashHandler}> Back to Dashboard</p>
                    <p className = "no-hover"> Seats4You </p>
                </div>

                <div className="main-container">

                <div className="deleteForm">
                <form onSubmit = {handleDeleteBlock}>
                    <h1 className="blockHeaderDelete">
                        Delete Block
                    </h1>
                    <div className = "stack">
                        <label>Block Name (Use menu on side)</label>
                        <input type="text" placeholder="blockName" onChange={(e) => setBlockName(e.target.value)} required/>
                        <button type="submit"> Delete Block </button>
                    </div>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>

                <Link to={`/show/createBlock/${showID}`}>
                    <button> Go to Create Block </button>
                </Link>
                </div>

                <div className="reportContainer">
                    <div>
                        <h1 className = "reportHeader">Blocks Created</h1>
                            <div className = "vmDashboardMenuReport" id="venueMenu">
                                {reportLoading ? (
                                    <span>Loading...</span>
                                    ) : blocks.length > 0 ? (
                                        <div>
                                            <div>
                                                {blocks.map((block, index) => (
                                                    <span className="blockItems" key={index}>
                                                        <strong>{block.blockName}</strong>
                                                        <p>Section: {block.section}</p>
                                                        <p>Rows: ({block.startRow},{block.endRow})</p>
                                                        <p>Columns: ({block.startCol},{block.endCol})</p>
                                                        <p>Seats Sold: {block.seatsSold}/{block.totalSeats}</p>
                                                        <p>Block Proceeds: ${block.totalProceeds}</p>
                                                        <p>Price Per Seat: ${block.seatPrice}</p>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                    ): (
                                    <span>No Blocks</span>
                                    )}
                            </div>    
                    </div>
                </div>

            </div>

            </div>
        </main>
    )
}

export default DeleteBlock;