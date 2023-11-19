import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
      </Routes>
    </div>
  );
}

export default App;
