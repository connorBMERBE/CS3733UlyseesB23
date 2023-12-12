import './Landing.css';
import React from 'react';
import {login, adminLogin, listActiveShows} from '../Controller/Controller.js';
import { Link } from 'react-router-dom';

export const Landing = () => {

    const [searchBarActive, setSearchBarActive] = React.useState(false);
    const [loginPopupVisible, setLoginPopupVisible] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [adminLoginStatus, setAdminLogin] = React.useState(false);
    const [loginStatus, setLoginStatus] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [shows, setShows] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const toggleSearchBar = () => {
        setSearchBarActive(!searchBarActive);
    }

    function clearSearchBar() {
        const search = document.getElementById('consumerSearch');
        search.value = '';
    }

    const showLoginPopup = (loginType) => {
        setLoginPopupVisible(true);
        if (loginType === 'admin') {
            setAdminLogin(true);
        } else {
            setAdminLogin(false);
        }
    }

    const hideLoginPopup = () => {
        setLoginPopupVisible(false);
        const usernameInput = document.getElementById('usernameInput');
        const passwordInput = document.getElementById('passwordInput');
        usernameInput.value = '';
        passwordInput.value = '';
        setLoginStatus('');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        let response = null;
        if (localStorage.getItem('token')) {
            window.location.href = '/failedLogin';
        }
        else if (adminLoginStatus) {
            response = await adminLogin(username, password);
        } else {
            response = await login(username, password);
            console.log(response);
        }

        if (response === false) {
            console.log(response);
            setLoginStatus("Invalid Credentials please try again.")
        }
    }

    const toCreateVenue = () => {
        window.location.href = "/createVenue";
    }

    React.useEffect(() => {
        const fetchShows = async() => {
            try {
                const showsInfo = await listActiveShows();
                const parsedShows = JSON.parse(showsInfo);
                console.log(parsedShows);
                setShows(parsedShows);
            } 
            catch (error) {
                console.error("Error fetching shows:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchShows();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filterShows = shows.filter((show) => 
        show.showName.toLowerCase().includes(searchTerm.toLowerCase())    
    );

    const parseDate = (dateIn) => {
        const dateOut = new Date(dateIn).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });

        return dateOut;
    }
    return (
    <main>
        <body className = "landingBody">
            <div className = "navBar">
                <p className = "loginTrigger" onClick={() => showLoginPopup('admin')}>Admin Login</p>
                <p className = "loginTrigger" onClick={() => showLoginPopup('venue manager')}>Venue Manager Login</p>
                <p className = "loginTrigger" onClick={toCreateVenue}>Create Venue/Register</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className = {`searchBar ${searchBarActive ? 'active' : ''}`}>
                <div className = "icon" onClick={toggleSearchBar}/>
                <div className = "input">
                    <input type="text" placeholder="Search for Shows" id = "consumerSearch" onChange={handleSearch}/>
                </div>
                <span className = "clear" onClick={clearSearchBar}/>
            </div>

            <div className ={`wrapper ${loginPopupVisible ? 'active' : ''}`}>
                <div className = "loginWrapper">
                    <span className = "closeIcon" onClick={hideLoginPopup}>&#10006;</span>
                    <h2> Login </h2>
                    <form onSubmit={handleLogin}>
                        <div className = "inputBox">
                            <input type="text" id="usernameInput" placeholder = "Username" onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div className = "inputBox">
                            <input type="password" id="passwordInput" placeholder = "Password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit" className="loginButton"> Login </button>
                        {loginStatus && <p className="error-message" id="errorMessage">{loginStatus}</p>}
                    </form>
                </div>
            </div>

            <div className = "showContainer">
                <div className = "showMenu">
                    {loading ? (
                        <span>Loading...</span>
                    ) : filterShows.length > 0 ? (
                            filterShows.map((show, index) => (
                                <Link to={`/show/${show.showID}`} key={index} className="showItem">
                                    <span className="showDetails">
                                        {`${show.showName} | ${parseDate(show.showDate)} | ${show.Time}`}
                                    </span>
                                </Link>
                                ))
                            ) : (
                                <span>No Shows Found</span>
                            )}
                </div>
            </div>

        </body>
    </main>);
}

export default Landing;