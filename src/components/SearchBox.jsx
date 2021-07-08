import React from 'react';
import JSONDATA from "../data/MOCK_DATA.json"
import './SearchBox.scss';
import { useState } from 'react';

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="search-box">
      <input type="text" name="searchBox" id="searchBox"
        placeholder="Search a business..."
        onChange={event => { setSearchTerm(event.target.value) }} />
      
      {searchTerm && <ul className="search-results">
        {JSONDATA.filter((val)=> {
          if (searchTerm == ""){
            return val
          } else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())){
            return val
          }
        }).map((val,key)=>{
          return(
            <li key={key}>{val.title}</li>
          );
        })}
      </ul>}
      </div>
  );
}

export default SearchBox;