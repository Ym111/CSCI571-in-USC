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
    },[kw,isGD])
    return (
        <div>
            <h3>Resutls:</h3> 
            <SearchNewsBody/>
        </div>
    )
}

export default SearchNews
