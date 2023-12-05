import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing.js';
import Test from './Pages/Test.js';
import FailedLogin from './Pages/FailedLogin.js';
import AdminPage from './Pages/adminPage.js';
import VMDashboard from './Pages/VMDashboard.js';
import PrivateRoutesVM from './Controller/PrivateRoutesVM.js';
import CreateShow from './Pages/createShow.js';
import CreateVenue from './Pages/CreateVenue.js';
import PrivateRoutesAdmin from './Controller/PrivateRoutesAdmin.js';
import ShowDetails from './Pages/showDetails.js';
import EnjoyShow from './Pages/enjoyShow.js';

function App() {

  function parseJwt(token) {
    // Step 1: Extract Payload
    const base64Url = token.split('.')[1];
  
    // Step 2: Base64 Decoding
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
  
    // Step 3: JSON Parsing
    return JSON.parse(jsonPayload);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    window.location.href = "/";
  }

  function checkExpiration() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = parseJwt(token);

      if (decodedToken.exp * 1000 <= Date.now()) {
        logout();
      }
    }
  }

  // Periodically check the token expiration (e.g., every 5 minutes)
  setInterval(checkExpiration, 20 * 60 * 1000);

  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
        <Route path = "/show/:showID" element = {<ShowDetails/>}/>

        <Route element = {<PrivateRoutesVM/>}>
          <Route path = "/test" element = {<Test/>} exact/>
          <Route path = "/vmDashboard" element = {<VMDashboard/>}/>
          <Route path = "/vmDashboard/createShow" element = {<CreateShow/>}/>
        </Route>

        <Route element = {<PrivateRoutesAdmin/>}>
          <Route path = "/adminPage" element = {<AdminPage/>}/>
        </Route>
          <Route path = "/createVenue" element = {<CreateVenue/>}/>
          <Route path = "/failedLogin" element = {<FailedLogin/>}/>
          <Route path = "/purchased" element = {<EnjoyShow/>}/>
      </Routes>
    </div>
  );
}

export default App;
