import React, { useContext, Fragment } from 'react'
import 'bootstrap/js/src/collapse.js'
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Switch from "react-switch";
import { useLocation, useHistory, NavLink } from 'react-router-dom';
import NewsContext from '../../contexts/newsContext'
import AutoSearch from './AutoSearch';
import ReactTooltip from 'react-tooltip'

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
                    <div className="navbar-nav ml-auto ">

                        <li className="nav-item">
                        
                            <div className="navbar-brand mb-1"   onClick={() => history.push("/Saved")}>
                                {(path === '/Saved') ? (
                                    <div data-tip="Bookmark" data-place="bottom"><FaBookmark/></div>
                                ) : (
                                    <div data-tip="Bookmark" data-place="bottom"><FaRegBookmark/></div>
                                    )}
                            </div>
                        </li>
                        {(path !== '/Saved') && (path.search("/newsdetail") !== 0 )&& (path.search("/Search") !== 0 )  && (
                            <Fragment>
                                <li>
                                    <span className=" navbar-brand" >NYTimes</span>
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
            <ReactTooltip  effect = 'solid'  place='bottom' />
        </div>
    )

}

export default Navbar
