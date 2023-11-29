import './Landing.css';
import React from 'react';
import {login} from '../Controller/Controller.js';

export const Landing = () => {

    const [searchBarActive, setSearchBarActive] = React.useState(false);
    const [loginPopupVisible, setLoginPopupVisible] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const toggleSearchBar = () => {
        setSearchBarActive(!searchBarActive);
    }

    function clearSearchBar() {
        const search = document.getElementById('consumerSearch');
        search.value = '';
    }

    const showLoginPopup = () => {
        setLoginPopupVisible(true);
    }

    const hideLoginPopup = () => {
        setLoginPopupVisible(false);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(username, password);
    }

    return (
    <main>
        <body className = "landingBody">
            <div className = "navBar">
                <p className = "loginTrigger" onClick={showLoginPopup}>Admin Login</p>
                <p className = "loginTrigger" onClick={showLoginPopup}>Venue Manager Login</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className = {`searchBar ${searchBarActive ? 'active' : ''}`}>
                <div className = "icon" onClick={toggleSearchBar}/>
                <div className = "input">
                    <input type="text" placeholder="Search for Shows" id = "consumerSearch"/>
                </div>
                <span className = "clear" onClick={clearSearchBar}/>
            </div>

            <div className ={`wrapper ${loginPopupVisible ? 'active' : ''}`}>
                <div className = "loginWrapper">
                    <span className = "closeIcon" onClick={hideLoginPopup}>&#10006;</span>
                    <h2> Login </h2>
                    <form onSubmit={handleLogin}>
                        <div className = "inputBox">
                            <input type="text" placeholder = "Username" onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div className = "inputBox">
                            <input type="password" placeholder = "Password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit" className="loginButton"> Login </button>
                    </form>
                </div>
            </div>
        </body>
    </main>);
}

export default Landing;