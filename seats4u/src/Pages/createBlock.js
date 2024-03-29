import React from 'react';
import { createBlockForShow, listBlockForShows } from '../Controller/Controller';
import { Link, useParams } from 'react-router-dom';
import './createBlock.css';

//each block must have unique name, start row, end row, start col, end col, and price

export const CreateBlock = (e) => {
    const [blockName, setBlockName] = React.useState('');
    const [startRow, setStartRow] = React.useState('');
    const [endRow, setEndRow] = React.useState('');
    const [startCol, setStartCol] = React.useState('');
    const [endCol, setEndCol] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [section, setSection] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [reportLoading, setReportLoading] = React.useState(false);
    const [blocks, setBlocks] = React.useState([]);
    const { showID } = useParams(); 

    React.useEffect(() => {
        // You can access showID here
        console.log('showID:', showID);
    },[showID]);


    const handleCreateBlock = async (e) =>{
        e.preventDefault();
        try {
            // Convert price to a float
            const numericPrice = parseFloat(price.replace('$', ''));

            const response = await createBlockForShow(showID, blockName, startRow, endRow, startCol, endCol, numericPrice, section);
            console.log(response);

            if (response) {
                setSuccessMessage("Block created successfully!");
                window.location.reload();
            } else {
                setErrorMessage("Could not Create the Block");
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
                    <form onSubmit = {handleCreateBlock}>
                        <h1 className="blockHeaderDelete">
                            Create Block
                        </h1>
                        <div className = "stack">
                            <label>Block Name (must be unique)</label>
                            <input type="text" placeholder="blockName" onChange={(e) => setBlockName(e.target.value)} required/>
                            <label>Section</label>
                            <input type="text" placeholder="Section" onChange={(e) => setSection(e.target.value)} required/>
                            <label>Start Row</label>
                            <input type="text" placeholder="startRowNumber" onChange={(e) => setStartRow(e.target.value)} required/>
                            <label>End Row</label>
                            <input type="text" placeholder="endRowNumber" onChange={(e) => setEndRow(e.target.value)} required/>
                            <label>Start Column</label>
                            <input type="text" placeholder="startColumnNumber" onChange={(e) => setStartCol(e.target.value)} required/>
                            <label>End Column</label>
                            <input type="text" placeholder="endColumnNumber" onChange={(e) => setEndCol(e.target.value)} required/>
                            <label>Block Price</label>
                            <input type="text" placeholder="$-" onChange={(e) => setPrice(e.target.value)} required/>
                            <button type="submit"> Create Block </button>
                        </div>

                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>

                    <Link to={`/show/deleteBlock/${showID}`}>
                        <button> Go to Delete Block</button>
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

export default CreateBlock