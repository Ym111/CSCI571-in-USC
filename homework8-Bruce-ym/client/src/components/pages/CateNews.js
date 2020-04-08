import React, { useContext, useEffect } from 'react'
import Newsbody from '../news/Newsbody'
import NewsContext from '../../contexts/newsContext'

const CateNews = ({ match }) => {
    //search different category news
    const newsContext = useContext(NewsContext);
    const { getNews, isGD } = newsContext;
    const category = match.params.cate;
    useEffect(() => {
        getNews(category);
        //eslint-disable-next-line
    }, [match.params.cate, isGD]);
    //console.log(newsLists);
    return (
        <div>
            <Newsbody />
        </div>
    )
}

export default CateNews
