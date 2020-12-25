import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';

import {history} from "../helpers";
import {authenticationService} from "../services";



function Nav() {

    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        authenticationService.currentUser.subscribe(x => setActiveUser(x));
    }, []);

    const logout = () => {
        authenticationService.logout();
        history.push('/');
    }

    return(
        <nav className="navbar navbar-expend navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                { activeUser && <NavLink to="/appointments" className="nav-item nav-link">Appointments</NavLink> }
                { activeUser &&  <a onClick={logout} className="nav-item nav-link">Logout</a>}
            </div>
        </nav>
    );
}

export {Nav};
