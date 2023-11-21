import './Landing.css';
import React from 'react';

export const Landing = () => {

    const [searchBarActive, setSearchBarActive] = React.useState(false);
    const toggleSearchBar = () => {
        setSearchBarActive(!searchBarActive);
    }

    function clearSearchBar() {
        const search = document.getElementById('consumerSearch');
        search.value = '';
    }

    return (
    <main>
        <body className = "landingBody">
            <div className = "navBar">
                <p>Admin Login</p>
                <p>Venue Manager Login</p>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className = {`searchBar ${searchBarActive ? 'active' : ''}`}>
                <div className = "icon" onClick={toggleSearchBar}/>
                <div className = "input">
                    <input type="text" placeholder="Search for Shows" id = "consumerSearch"/>
                </div>
                <span className = "clear" onClick={clearSearchBar}/>
            </div>
        </body>
    </main>);
}

export default Landing;