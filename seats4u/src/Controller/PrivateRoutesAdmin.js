import {Outlet, Navigate} from 'react-router-dom';

const PrivateRoutesAdmin = () => {
    let token = localStorage.getItem('token');
    let isAuthenticated = token ? true : false;

    let role = localStorage.getItem('role');
    let isAdmin = (role === 'administrator') ? true : false;

    return (
        (isAuthenticated && isAdmin ) ? <Outlet/> : <Navigate to="/failedLogin"/>
    )
}

export default PrivateRoutesAdmin;