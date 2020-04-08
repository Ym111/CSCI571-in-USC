import React,{useContext} from 'react'
import Spinner from '../layout/Spinner'
import NewsContext from '../../contexts/newsContext'
import SavedNewsItem from './SavedNewsItem'

const SearchNewsBody=()=>{
    const newsContext = useContext(NewsContext)
    const { loading, newsLists } = newsContext;

    if (loading) {
        return <Spinner />
    } else {
        if(newsLists.length >0){
            return (
                <div className="row">
                    {newsLists.map(news => (
                       <SavedNewsItem key={news.article_id} news={news}/>
                    ))}
                </div>
            );
        }else{
            return(
                <div>
                    <h3>No Search Results.</h3>
                </div>

            )
        }
        

    }
}

export default SearchNewsBody
