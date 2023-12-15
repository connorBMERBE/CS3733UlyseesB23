import begins from './SoItBegins.gif';
import './showHasBegun.css'
import {Link} from 'react-router-dom';

export const ShowHasBegun = () => {
    return(
        <main>
            <div className = "navBar">
                <Link to="/">
                    <p className = "loginTrigger"> Home </p>
                </Link>
                <p className = "no-hover"> Seats4You </p>
            </div>

            <div className="container">
                <h1> Uh Oh Your Show has Already Begun</h1>
                <img className="frodoBaggins" src={begins} alt=""/>
            </div>
        </main>
    );
}

export default ShowHasBegun;