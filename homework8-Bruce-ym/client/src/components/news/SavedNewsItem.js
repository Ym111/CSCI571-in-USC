import React, { useContext, Fragment, useState } from 'react'
import { useHistory,useLocation } from 'react-router-dom';
import { MdDelete, MdShare } from "react-icons/md";
import NewsContext from '../../contexts/newsContext';
import Modal from 'react-bootstrap/Modal';
import ShareIcon from '../layout/ShareIcon';
import { ToastContainer, toast,Zoom } from 'react-toastify';
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
            
            <div className="col-md-3 mt-1" >
            <div className="card  m-3  p-2  border" onClick={() => { history.push(`/newsdetail/article?id=${article_id}`) }}>
                <div className="card-title ">
                    
                    <h5 className="card-title font-italic">{title} 
                    <span className="">
                        {isSave && <MdDelete onClick={(e) => {
                            e.stopPropagation();
                            delnews(tmpnews);
                            toast("Removing " + title);
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
                    <span className="card-text text-muted mytime">{date}</span>
                    <div className="d-flex">
                    <span className={"badge text-uppercase m-1 myst st-"+section }>{section}</span>
                    {isSave &&<span className={" badge text-uppercase m-1 myst st-" +source }>{source}</span>}
                    </div>
                   
                </div>
            </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isSave&&source}
                    {isSave&&<br/>}
                    <small>{title} </small>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign:"center"}}> <h5>Share via</h5> </Modal.Body>
                <ShareIcon size={60} url={web_url} />
            </Modal>
            
        </Fragment>
    )
}

export default SavedNewsItem
