import React, { useReducer } from 'react';
import axios from 'axios';
import NewsContext from './newsContext';
import NewsReducer from './newsReducer';
import Config from '../config/config'
import {
    SET_ISGD,
    SET_NOGD,
    SET_LOADING,
    GET_NEWS,
    SEARCH_NEWS,
    ADD_NEWS,
    DEL_NEWS,
    SET_NOSAVED,
    SET_SAVED,
    SEARCH_NEWS_BY_QUERY
} from './types'


const NewsState = pros => {
    //localStorage.removeItem("isGD");
    const localState = {
        newsLists: [],
        savedLists:JSON.parse(localStorage.getItem("savedLists")) || [],
        news: {},
        loading: false,
        isGD: Number(localStorage.getItem("isGD")) ,
        isSave:false,
        category: 0
    }

    // const initialState = {
    //     newsLists: [],
    //     savedLists: [],
    //     news: {},
    //     loading: false,
    //     isGD: true,
    //     isSave:false,
    //     category: 0
    // }
    
    
    

    const [state, dispatch] = useReducer(NewsReducer, localState);


    // Function -> add in value
    //  Search news
    const getNews = async text => {
        setLoading();
        let url = "";
        if (state.isGD) {
            url = Config.HOST_ADDRESS + '/GD/getNews/' + text;
        } else {
            url = Config.HOST_ADDRESS + '/NY/getNews/' + text;
        }
        console.log(url);
        const res = await axios.get(url);
        dispatch({
            type: GET_NEWS,
            payload: res.data
        })
    };
    // search the news details
    const searchNews = async text => {
        setLoading();
        let url = "";
        
        if(text.search("www.nytimes.com") ===-1) {
            url = Config.HOST_ADDRESS + '/GD/searchNews/article?id=' + text;
        } else {
            url = Config.HOST_ADDRESS + '/NY/searchNews/article?id=' + text;
        }
        //console.log(url)
        const res = await axios.get(url);
        dispatch({
            type: SEARCH_NEWS, 
            payload: res.data
        })
    };
    const addnews=async news=>{
        checknews(news);
        let tmpar  = state.savedLists;
        tmpar.push(news);
        dispatch({
            type:ADD_NEWS,
            payload:tmpar
        })
        console.log("delect article : "+news.article_id);
    }

    const delnews =async news=>{
        console.log("delnews:"+news)
        let ind = -1;
        for(var i=0;i<state.savedLists.length;i++){
            if(state.savedLists[i].article_id === news.article_id){
                ind = i;
                break;
            }
        }
        if(ind > -1){
            let tmpar  = state.savedLists;
            tmpar.splice(ind,1);
            dispatch({
                type:DEL_NEWS,
                payload:tmpar
            })
            console.log("delect article : "+news.article_id);
        }
    }
    const checknews=async news=>{
        //console.log("checknews:"+news)
        for(var i=0;i<state.savedLists.length;i++){
            if(state.savedLists[i].article_id === news.article_id){
                console.log("exist: "+news.article_id)
                dispatch({
                    type:SET_SAVED
                })
                return;
            }
        }
        dispatch({
            type:SET_NOSAVED
        })
        
    }
    //set isGD
    const setGD = () => {
        if (!state.isGD) {
            dispatch({
                type: SET_ISGD,
            })
        } else {
            dispatch({
                type: SET_NOGD,
            })
        }
    };
    // searchbyquery 
    const searchByQuery = async text =>{
        setLoading();
        let url = '';
        if(state.isGD){// use GD to search /GD/searchByQuery
            url = Config.HOST_ADDRESS + '/GD/searchByQuery/news?q=' + text;
        }else{
            url = Config.HOST_ADDRESS + '/NY/searchByQuery/news?q=' + text;
        }
        //console.log(url)
        const res = await axios.get(url);
        dispatch({
            type: SEARCH_NEWS_BY_QUERY, 
            payload: res.data
        })
    }

    //  Set loading 
    const setLoading = () => dispatch({ type: SET_LOADING });

    return <NewsContext.Provider
        value={{
            newsLists: state.newsLists,
            savedLists: state.savedLists,
            news: state.news,
            loading: state.loading,
            isGD: state.isGD,
            category: state.category,
            isSave: state.isSave,
            setGD,
            getNews,
            searchNews,
            addnews,
            delnews,
            checknews,
            searchByQuery
        }} >
        {pros.children}
    </NewsContext.Provider>

}

export default NewsState