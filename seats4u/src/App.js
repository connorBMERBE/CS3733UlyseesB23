import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing.js';
import Test from './Pages/Test.js';
import FailedLogin from './Pages/FailedLogin.js';
import PrivateRoutesVM from './Controller/PrivateRoutesVM.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
        <Route element = {<PrivateRoutesVM/>}>
          <Route path = "/test" element = {<Test/>} exact/>
        </Route>
          <Route path = "/failedLogin" element = {<FailedLogin/>}/>
      </Routes>
    </div>
  );
}

export default App;
