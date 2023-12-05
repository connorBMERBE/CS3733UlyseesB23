import frodo from './LOTR.gif';
import './enjoyShow.css'
import {Link} from 'react-router-dom';

export const EnjoyShow = () => {
    return(
        <main>
            <div className = "navBar">
                <Link to="/">
                    <p className = "loginTrigger"> Home </p>
                </Link>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className="container">
                <h1> Enjoy Your Show</h1>
                <img className="frodoBaggins" src={frodo} alt=""/>
            </div>
        </main>
    );
}

export default EnjoyShow;