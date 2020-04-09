import React, { useContext, useEffect, Fragment, useState } from 'react';
import NewsContext from '../../contexts/newsContext';
import Spinner from '../layout/Spinner';
import { useLocation } from 'react-router-dom';
import CommentBox from '../layout/CommentBox';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import ShareIcon from '../layout/ShareIcon';
import { ToastContainer, toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip'
import Truncate from 'react-truncate';
import { IoIosArrowDown,IoIosArrowUp } from "react-icons/io";
import { Element, animateScroll as scroll, scroller } from 'react-scroll'

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

    // function extend the details 
    const lines = 4; 
    const [truncated, settruncated] = useState(false)
    const [expanded, setexpanded] = useState(false)
    const handleTruncate = newtruncated => {
        if (truncated !== newtruncated) {
            settruncated(newtruncated)
        }
    }
    const toggleLines = e => {
        e.preventDefault();
        setexpanded(!expanded)
    }
    // scroll 
    const scrollToTop = () => {
        scroll.scrollToTop();
    };


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
                    transition={Zoom}
                    pauseOnVisibilityChange
                    draggable
                    toastClassName="mytoast"
                    pauseOnHover
                />
                
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
                                    <FaBookmark size={28} color={'red'} data-tip="Bookmark" onClick={() => {
                                        delnews(news);
                                        toast("Removing " + title);
                                    }} /> :
                                    <FaRegBookmark size={28} color={'red'} data-tip="Bookmark" onClick={() => {
                                        addnews(news);
                                        toast("Saving " + title);

                                    }} />
                                }
                            </div>
                        </div>

                    </div>
                    <img src={image_url} className="img-fluid" alt="Loading..." />
                    <Element className="scroll-to-element">
                        <Truncate
                            lines={!expanded && lines}
                            ellipsis={(
                                <span>
                                <span>...  </span>
                                <div > <IoIosArrowDown onClick={e=>{
                                    toggleLines(e);
                                    scroller.scrollTo('scroll-to-element', {
                                        duration: 800,
                                        delay: 0,
                                        smooth: 'easeInOutQuart'
                                      });
                                }}  size= '2em' style={{float:"right"}}  /></div>
                                </span>
                            )}
                            onTruncate={handleTruncate}
                        >
                            {desc}
                        </Truncate>
                        {!truncated && expanded && (
                            <div> <IoIosArrowUp onClick={e=>{toggleLines(e);scrollToTop()}} size= '2em' style={{float:"right"}}/></div>
                        )}
                    </Element>

                </div>
                <CommentBox id={article_id} />
                
                <ReactTooltip effect='solid' />
            </Fragment>
        )


    }

}

export default Newsdetails
