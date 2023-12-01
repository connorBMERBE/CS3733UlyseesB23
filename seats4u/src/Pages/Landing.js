import './Landing.css';
import React from 'react';
import {login, adminLogin} from '../Controller/Controller.js';

export const Landing = () => {

    const [searchBarActive, setSearchBarActive] = React.useState(false);
    const [loginPopupVisible, setLoginPopupVisible] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [adminLoginStatus, setAdminLogin] = React.useState(false);
    const [loginStatus, setLoginStatus] = React.useState('');

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
        }

        if (response === false) {
            console.log(response);
            setLoginStatus("Invalid Credentials please try again.")
        }
    }

    return (
    <main>
        <body className = "landingBody">
            <div className = "navBar">
                <p className = "loginTrigger" onClick={() => showLoginPopup('admin')}>Admin Login</p>
                <p className = "loginTrigger" onClick={() => showLoginPopup('venue manager')}>Venue Manager Login</p>
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
        </body>
    </main>);
}

export default Landing;