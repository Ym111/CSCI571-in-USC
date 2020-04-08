import React, { useContext, useEffect, Fragment } from 'react';
import NewsContext from '../../contexts/newsContext';
import Spinner from '../layout/Spinner';
import { useLocation } from 'react-router-dom';
import CommentBox from '../layout/CommentBox';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import LinesEllipsis from 'react-lines-ellipsis';
import ShareIcon from '../layout/ShareIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip'

const Newsdetails = () => {
    const newsContext = useContext(NewsContext)
    const location = useLocation();
    const articleid = location.search.substr(4);
    const { searchNews, loading, addnews, checknews, delnews, isSave, news } = newsContext;
    useEffect(() => {
        searchNews(articleid);
        //eslint-disable-next-line
    }, [])
    const {
        title,
        image_url,
        date,
        desc,
        web_url,
        article_id
    } = news;
    useEffect(() => {
        checknews(news);
        //eslint-disable-next-line
    }, [isSave, news])

    if (loading) {
        return <Spinner />
    } else {
        return (

            <Fragment>
                

                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                <ReactTooltip effect='solid'/>
                <div className='card m-4 border shadow p-4'>
                    <h3 className="card-title font-italic">{title}</h3>

                    <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-text ">{date}</h5>
                        <div className="d-flex ">
                            <div className="mr-3">
                                <ShareIcon size={30} url={web_url} />
                            </div>
                            <div className="ml-3" data-tip="BookMark">
                            
                                {isSave ?
                                    <FaBookmark size={28} color={'red'} data-tip="BookMark" onClick={() => {
                                        delnews(news);
                                        toast("Removing " + title, {
                                            position: "top-center",
                                            autoClose: 3000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true
                                        });
                                    }} /> :
                                    <FaRegBookmark size={28} color={'red'} data-tip="BookMark" onClick={() => {
                                        addnews(news);
                                        toast("Saving " + title, {
                                            position: "top-center",
                                            autoClose: 3000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true
                                        });

                                    }} />
                                }
                            </div>
                        </div>

                    </div>
                    <img src={image_url} className="img-fluid" alt="Loading..." />
                    <LinesEllipsis
                        text={desc}
                        maxLine='4'
                        ellipsis='...'
                        basedOn='words'
                        style={{ whiteSpace: 'pre-wrap' }}
                    />

                </div>
                <CommentBox id={article_id} />
            </Fragment>
        )


    }

}

export default Newsdetails
