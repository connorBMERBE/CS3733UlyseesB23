import './Landing.css';
import React from 'react';

export const Landing = () => {

    const [searchBarActive, setSearchBarActive] = React.useState(false);
    const [loginPopupVisible, setLoginPopupVisible] = React.useState(false);

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

    return (
    <main>
        <body className = "landingBody">
            <div className = "navBar">
                <p onClick={showLoginPopup}>Admin Login</p>
                <p onClick={showLoginPopup}>Venue Manager Login</p>
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
                    <form action = "#">
                        <div className = "inputBox">
                            <input type="text" placeholder = "Username" required/>
                        </div>
                        <div className = "inputBox">
                            <input type="password" placeholder = "Password" required/>
                        </div>
                        <button type="submit" className="loginButton"> Login </button>
                    </form>
                </div>
            </div>
        </body>
    </main>);
}

export default Landing;