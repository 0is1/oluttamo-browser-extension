import React from "react";
import { render } from "react-dom";
import SearchResults from "./components/SearchResults";
import { BEER_KEY_NAME, SEARCH_KEY_NAME, REACT_ROOT_DIV_ID, BEER_API_URL, BEER_API_SEARCH_PREFIX } from "./constants";
import getCurrentSearchString from "./lib/getCurrentSearchString";
import setData from "./lib/setData";

/*
* Search beer data from Oluttamo API
*/
function search(){
    getCurrentSearchString((searchQuery) =>{
        if(searchQuery){
            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = (data) => {
                // TODO: handle errors :)
                if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                    const json = JSON.parse(httpRequest.responseText);
                    setData(BEER_KEY_NAME, {query: searchQuery, data: json, url: window.location.href});
                    addSearchResults(searchQuery, json);
                } else if(httpRequest.status === 404){
                    addSearchResults(searchQuery, [], "404");
                }
            };
            // Replace all forward slashes with %20
            const escapedQuery = searchQuery.replace(/\s{0,}\/\s{0,}/g, "%20");
            httpRequest.open("GET", `${BEER_API_URL}${BEER_API_SEARCH_PREFIX}${escapedQuery}`);
            httpRequest.send();
        }
    });
}

// render search results react element
function addSearchResults(searchQuery, data, error=false){
    createRootDiv(()=>{
        render(<SearchResults q={searchQuery} data={data} error={error}/>, document.getElementById(REACT_ROOT_DIV_ID));
    });
}

// Create react root div it doesn't exist yet
const createRootDiv = (cb) => {
    const elementExists = document.getElementById(REACT_ROOT_DIV_ID);
    if(!elementExists){
        let g = document.createElement("div");
        g.id = REACT_ROOT_DIV_ID;
        document.body.insertBefore(g, document.body.firstChild);
        return cb();
    } else {
        return cb();
    }
};

search();

export default search;
