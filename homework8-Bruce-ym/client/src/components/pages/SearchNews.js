import React, { useEffect,useContext } from 'react'
import { useLocation } from 'react-router-dom';
import NewsContext from '../../contexts/newsContext'
import SearchNewsBody from '../news/SearchNewsBody';

const SearchNews=(match)=>{
    const location = useLocation();
    const kw = location.search.substr(3);
    const newsContext = useContext(NewsContext);
    const {isGD, searchByQuery} = newsContext;
    useEffect(()=>{
        searchByQuery(kw);
        //eslint-disable-next-line
    },[kw,isGD])
    return (
        <div>
            
            <SearchNewsBody/>
        </div>
    )
}

export default SearchNews
