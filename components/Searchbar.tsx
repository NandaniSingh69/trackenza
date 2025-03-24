"use client"
import {FormEvent, useState } from "react";
import React from  "react";

const isvalidAamazonProductURL = (url:string) => {
try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

if(hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon'))
{
    return true;
}
}catch(error){
    return false;
}
return false;
}
const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const handlesubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isvalidLink = isvalidAamazonProductURL(searchPrompt);

        if(!isvalidLink) return alert('Please provide a valid Amazon link')
        
            try {
                setIsLoading(true);
                
            }catch (error) {
                console.log(error);
            }finally {
                setIsLoading(false);
            }
    }

   return (
    <form className="flex flex-wrap gap-4 mt-12" 
    onSubmit={handlesubmit}
    >

    <input 
    type = "text"
    value={searchPrompt}
    onChange={(e) => setSearchPrompt(e.target.value)}
    placeholder="Enter product link"
    className="searchbar-input"    
    />
     <button type = 'submit' 
     className="searchbar-btn"
     disabled = {searchPrompt === ''}>
        {isLoading ? 'searching...' : 'search'}
     
     </button>    
    </form>
   )
}
 
export default Searchbar