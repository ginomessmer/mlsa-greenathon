import React from 'react';
import JSONDATA from "./MOCK_DATA.json"
import './SearchBox.scss';
import {useState} from 'react';
function SearchBox() {
const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="search-box">
      <input type="text" name="searchBox" id="searchBox" placeholder="Search a business..." onChange={event => {setSearchTerm(event.target.value)}}/>
      {JSONDATA.filter((val)=> {
        if (searchTerm == ""){
          return val
        } else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())){
          return val
        }
      }).map((val,key)=>{
        return(
         <div className="user" key={key}>
         <p>{val.title}</p>
         </div>
       );
      })}
      </div>
  );
}

export default SearchBox;