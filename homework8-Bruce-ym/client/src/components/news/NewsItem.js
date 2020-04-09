import React, { useState, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import LinesEllipsis from 'react-lines-ellipsis';
import { useHistory } from 'react-router-dom';
import { FaShareAlt } from "react-icons/fa";
import ShareIcon from '../layout/ShareIcon';

const NewsItem = ({ news: { title, image_url, section, date, desc, article_id, web_url} }) => {
    //console.log(image_url)
    //const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => { setShow(true); }


    return (
        <Fragment>
            <div className="card mb-3 shadow rounded p-2" onClick={() => {
                //e.preventDefault();
                history.push(`/newsdetail/article?id=${article_id}`)
            }} >
                <div className="row card-body ">
                    <img src={image_url} className="card-img col-md-3 border p-1" alt="..." />

                    <div className="card-body col-md-9">
                        <h4 className="card-title font-italic">{title} <FaShareAlt onClick={(e) => {
                            e.stopPropagation();
                            handleShow();
                        }} /></h4>
                        <LinesEllipsis className="card-text"
                            text={desc}
                            maxLine='3'
                            ellipsis='...'
                            basedOn='words'
                            style={{ whiteSpace: 'pre-wrap' }}
                        />
                        <div className="mt-4 card-text d-flex justify-content-between">
                            <h6 className="mytime">{date}</h6>
                            <h6 className={`rounded pl-1 pr-1 text-uppercase myst st-${section}`}> {section}</h6>
                        </div>

                    </div>

                </div>




            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign:"center"}}> <h5>Share via</h5> </Modal.Body>
                <ShareIcon size={60} url={web_url} />
            </Modal>
        </Fragment>

    )
}

export default NewsItem
