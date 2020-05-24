import React, { useContext } from 'react'
import NewsContext from '../../contexts/newsContext'
import Spinner from '../layout/Spinner';
import NewsItem from './NewsItem';

const Newsbody = () => {
    const newsContext = useContext(NewsContext)
    const { loading, newsLists } = newsContext;
    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className = "p-3">
                {newsLists.map(news => (
                    <NewsItem key={news.article_id} news={news} />
                ))}
            </div>
        );

    }

}

export default Newsbody
