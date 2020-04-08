import React, { useContext, Fragment, useState } from 'react'
import { useHistory,useLocation } from 'react-router-dom';
import { MdDelete, MdShare } from "react-icons/md";
import NewsContext from '../../contexts/newsContext';
import Modal from 'react-bootstrap/Modal';
import ShareIcon from '../layout/ShareIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedNewsItem = ({ news: { title, image_url, section, date, article_id, web_url,source } }) => {
    const history = useHistory();
    const newsContext = useContext(NewsContext);
    const { delnews } = newsContext;
    const tmpnews = {
        'article_id': article_id,
    }
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => { setShow(true); }
    const location = useLocation();
    const path = location.pathname;
    const isSave = path.search('/Save') ? false:true;
    return (
        <Fragment>
            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            <div className="col-md-3 mt-1" >
            <div className="card  m-3  p-2  border" onClick={() => { history.push(`/NewsDetail/article?id=${article_id}`) }}>
                <div className="card-title ">
                    
                    <h5 className="card-title font-italic">{title} 
                    <span className="">
                        {isSave && <MdDelete onClick={(e) => {
                            e.stopPropagation();
                            delnews(tmpnews);
                            toast("Removing " + title, {
                                position: "top-center",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                        }} />}
                        <MdShare onClick={(e) => {
                            e.stopPropagation();
                            handleShow();
                        }} />
                    </span>
                    </h5>
                </div>


                <img src={image_url} className="card-img-top" alt="..." />
                <div className="card-body d-flex justify-content-between mb-2">
                    <span className="card-text text-muted mytime"><small>{date}</small></span>
                    <div className="d-flex">
                    <span className={"card-text text-uppercase rounded mr-1 pl-1 pr-1 myst st-"+section }><small>{section}</small></span>
                    {isSave &&<span className={"card-text text-uppercase rounded ml-1 pl-1 pr-1  st-" +source }><small>{source}</small></span>}
                    </div>
                   
                </div>
            </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{source}
                    <br/>
                    <small>{title} </small>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Share via</Modal.Body>
                <ShareIcon size={60} url={web_url} />
            </Modal>
            
        </Fragment>
    )
}

export default SavedNewsItem
