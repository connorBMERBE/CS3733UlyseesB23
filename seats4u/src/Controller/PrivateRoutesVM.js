import {Outlet, Navigate} from 'react-router-dom';

const PrivateRoutesVM = () => {
    let token = localStorage.getItem('token');
    let isAuthenticated = token ? true : false;

    let role = localStorage.getItem('role');
    let isVenueManager = (role === 'venue manager') ? true : false;

    console.log('Token:', token);
    console.log('IsAuthenticated:', isAuthenticated);

    return (
        (isAuthenticated && isVenueManager) ? <Outlet/> : <Navigate to="/failedLogin"/>
    )
}

export default PrivateRoutesVM;