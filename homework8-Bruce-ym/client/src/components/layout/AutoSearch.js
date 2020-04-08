import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import Axios from 'axios';
import config from '../../config/config';
import { useHistory, useLocation } from 'react-router-dom';

const AutoSearch = () => {
    //check for search 
    let kw = null;
    const location = useLocation();
    const [results, setresults] = useState([]);
    const [selectedResult, setselectedResults] = useState(kw);
    const [inputValue, setinputValue] = useState('');
    const history = useHistory();
    useEffect(() => {
        if (location.pathname === "/Search/news") {
            kw = location.search.substr(3);
            setselectedResults({label:kw})
        } else {
            setselectedResults(null)
        }
    }, [location.pathname,])
    //fetch results 
    const handleSearchChange = async text => {
        //console.log(text)
        try {
            const url = config.AUTO_SUGGEST_URL + `?q=${inputValue}`;
            const response = await Axios.get(url, {
                headers: {
                    "Ocp-Apim-Subscription-Key": config.AUTO_SUGGEST_KEY
                }
            });
            //console.log(response.data)
            //const data = await JSON.stringify(response.data);
            const resultsRaw = response.data.suggestionGroups[0].searchSuggestions;
            const results = resultsRaw.map(result => ({
                value: result.displayText, label: result.displayText,
            }));
            setresults({ results });
            return results;
        } catch (error) {
            console.log("ERROR: " + error)
        }
    }
    const handleInputChange = async text => {
        //console.log(text)
        setinputValue(text);
        return text;
    }
    const handleClick = async result => {
        setselectedResults({label:result.value});
        history.push("/Search/news?q=" + result.value);
    }

    return (
        <AsyncSelect
            cacheOptions
            onInputChange={handleInputChange}
            value={selectedResult}
            onChange={handleClick}
            placeholder='Enter Keyword ..'
            noOptionsMessage={() => 'No Match'}
            loadOptions={handleSearchChange}
        />
    )
}

export default AutoSearch
