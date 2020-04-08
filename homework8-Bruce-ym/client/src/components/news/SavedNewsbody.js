import React,{useContext} from 'react'
import Spinner from '../layout/Spinner'
import NewsContext from '../../contexts/newsContext'
import SavedNewsItem from './SavedNewsItem'

const SavedNewsbody=()=>{
    const newsContext = useContext(NewsContext)
    const { loading, savedLists } = newsContext;

    if (loading) {
        return <Spinner />
    } else {
        if(savedLists.length >0){
            return (
                <div className="row">
                    {savedLists.map(news => (
                       <SavedNewsItem key={news.article_id} news={news}/>
                    ))}
                </div>
            );
        }else{
            return(
                <div style={{textAlign:"center"}}>
                    <h3> You have no saved articles </h3>
                </div>

            )
        }
        

    }
}

export default SavedNewsbody
