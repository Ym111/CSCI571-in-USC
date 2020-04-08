import React, { useContext, Fragment } from 'react'
import 'bootstrap/js/src/collapse.js'
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Switch from "react-switch";
import { useLocation, useHistory, NavLink } from 'react-router-dom';
import NewsContext from '../../contexts/newsContext'
import AutoSearch from './AutoSearch';

const Navbar = () => {
    const newsContext = useContext(NewsContext);
    const { isGD, setGD } = newsContext;
    const history = useHistory();
    const location = useLocation();
    const path = location.pathname;
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-light">
                <div className="auto-search">
                    <AutoSearch />
                </div>
                <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarTogglerDemo02">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <div className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/Home")} >Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/World")} >World</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/Politics")} >Politics</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/Business")} >Business</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/Technology")} >Technology</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link " activeClassName="active" to={("/Sports")} >Sports</NavLink>
                        </li>
                    </div>
                    <div className="navbar-nav ml-auto mt-2 mt-lg-0 ">

                        <li className="nav-item">
                            <div className="navbar-brand" type="button" onClick={() => history.push("/Saved")}>
                                {(path === '/Saved') ? (
                                    <FaBookmark />
                                ) : (
                                        <FaRegBookmark />
                                    )}
                            </div>
                        </li>
                        {(path !== '/Saved') && (path.search("/NewsDetail") !== 0 )&& (path.search("/Search") !== 0 )  && (
                            <Fragment>
                                <li>
                                    <span className=" navbar-brand" >NY Times</span>
                                </li>
                                <li>
                                    <div className="navbar-brand">
                                        <Switch onChange={e => setGD()}
                                            checked={isGD === 1 ? true : false}
                                            onColor={'#37AAF0'}
                                            offColor={'#D3D3D3'}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <span className="navbar-brand">Guardian</span>
                                </li>
                            </Fragment>
                        )}
                    </div>

                </div>

            </nav>
        </div>
    )

}

export default Navbar
