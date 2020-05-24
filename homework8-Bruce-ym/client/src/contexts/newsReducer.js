import {
    GET_NEWS,
    SET_LOADING,
    SET_ISGD,
    SET_NOGD,
    SEARCH_NEWS,
    ADD_NEWS,
    DEL_NEWS,
    SET_NOSAVED,
    SET_SAVED,
    SEARCH_NEWS_BY_QUERY
} from './types'


export default (state, action) => {
    console.log(action.type);
    switch (action.type) {
        case GET_NEWS:
            return {
                ...state,
                newsLists: action.payload,
                loading: false
            }
        case SEARCH_NEWS_BY_QUERY:
            return{
                ...state,
                newsLists: action.payload,
                loading:false
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case SET_NOSAVED:
            return {
                ...state,
                isSave: false
            }
        case SET_SAVED:
            return {
                ...state,
                isSave: true
            }
        case SEARCH_NEWS:
            return {
                ...state,
                news: action.payload,
                loading: false
            }
        case ADD_NEWS:
            localStorage.setItem("savedLists",JSON.stringify(action.payload));
            return {
                ...state,
                savedLists: action.payload,
                isSave: true,
            }
        case DEL_NEWS:
            localStorage.setItem("savedLists",JSON.stringify(action.payload));
            return {
                ...state,
                savedLists: action.payload,
                isSave: false,
            }
        case SET_ISGD:
            localStorage.setItem("isGD", 1);
            return {
                ...state,
                isGD: 1
            }
        case SET_NOGD:
            localStorage.setItem("isGD",0);
            return {
                ...state,
                isGD: 0
            }
        default:
            return state;
    }
}