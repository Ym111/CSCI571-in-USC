import React,{useContext, Fragment} from 'react'
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
                <Fragment>
                <h3>Results:</h3>
                <div className="row">
                    {newsLists.map(news => (
                       <SavedNewsItem key={news.article_id} news={news}/>
                    ))}
                </div>
                </Fragment>
            );
        }else{
            return(
                <div>
                    <h3 style={{textAlign:"center"}}>No Search Results.</h3>
                </div>

            )
        }
        

    }
}

export default SearchNewsBody
