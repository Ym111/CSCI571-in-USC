import React, { useContext, useEffect } from 'react'
import Newsbody from '../news/Newsbody'
import NewsContext from '../../contexts/newsContext'
import Navbar from '../layout/Navbar';
const Home = () => {
    //search home news
    const newsContext = useContext(NewsContext);
    const { getNews, isGD } = newsContext;
    useEffect(() => {
        getNews("Home");
        //eslint-disable-next-line
    }, [isGD]);
    //console.log(newsLists);
    return (
        <div>
             <Navbar />
            <Newsbody />
        </div>
    )
}

export default Home
