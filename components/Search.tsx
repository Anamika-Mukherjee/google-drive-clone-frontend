"use client";

import React, { useState,FormEvent, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { SearchFileInfo } from "@/types";
import { getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import {useDebounce} from "use-debounce";

//component for searchbar functionality
const Search = () =>{

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    const [query, setQuery]=useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchFileInfo[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [isQuery, setIsQuery] = useState<boolean>(false);

    //add a delay before the query is sent with the api to the backend (to minimize overloading of api requests on each keypress)
    const [debouncedQuery] = useDebounce(query, 500)

    //set isQuery state to true if there is a query in searchbar
    useEffect(()=>{
        if(debouncedQuery.length>0){
            setIsQuery(true);
        }
    }, [debouncedQuery]);

    //call this function whenever debouncedQuery value changes
    useEffect(()=>{
        const fetchFiles = async ()=>{

            //if no query in searchbar
            if(debouncedQuery.length === 0){
                //set results array state to empty array, open state to false, isQuery state to false
                setResults([]);
                setOpen(false);
                setIsQuery(false);

                //redirect to present route but without the query string
                return router.push(pathName.replace(searchParams.toString(), ""));
            }

            //if query available in searchbar:
            try{
               //retrieve access token from sessionStorage and if not available, redirect to sign in page 
               const token = sessionStorage.getItem("accessToken");
               if(!token){
                router.push("/sign-in");
                throw new Error("Token not available!");
               }
 
               //api call to backend to get results for the query
               const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search`, {
                params: {
                    query: debouncedQuery
                },
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
               });

               //if api request unsuccessful, throw an error
               if(response.status !== 200){
                throw new Error("Could not retrieve search results!");
               }
               
               //if response contains files, store the array of files into results state variable and set open state to true
               if(!response.data.message){
                setResults(response.data);
                setOpen(true);
               }
            }
            catch(err){
                //if error, store error message into error state variable
                if(err instanceof Error){
                    setError(err.message);
                }
            }
        };

        //call the fetchFiles() function to execute the function whenever the value of debouncedQuery changes
        fetchFiles();
     }, [debouncedQuery])

     //function to handle click event for files returned as query results
     const handleClickItem = (file: SearchFileInfo)=>{

        //reset state variables to initial values
         setOpen(false);
         setResults([]);
         setIsQuery(false);

         //redirect to the page that contains the clicked file
         router.push(`/${(file.file_type === "video" || file.file_type === "audio")? "media": `${file.file_type}s`}`);
     }
      
    return(
        <div className="w-[350px] h-[40px] flex justify-start items-center p-1">
            <div className="w-full h-full flex justify-start items-center">
                <Input
                    value={query}
                    placeholder="Search..."
                    className="w-[250px] h-[30px] ml-2 text-base focus:outline-brand"
                    onChange={(e)=>setQuery(e.target.value)}
                />
                <div className="w-[25px] h-[25px] flex justify-center items-center absolute top-[26px] left-[920px]">
                    <Image 
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={15}
                    height={15}
                    />
                </div>
            </div>

            {/* if query available in searchbar, render the div element to show query results */}
            {isQuery ? (
                    <div className="w-full h-full">
                        
                    {/* if open state is true, render div element to show file list from the query results */}
                    {open ? (
                        <div className="w-[450px] h-auto bg-white border-2 rounded-lg flex flex-col justify-center items-center absolute top-[60px] left-[700px] z-10 p-2">
                            <ul className="w-full h-auto flex flex-col justify-between items-center">

                            {/* if results has files, map each file and render file information in list form */}
                            {results.length > 0 && results.map((file)=>{
                            const {extension} = getFileType(file.file_name);
                            return(
                                <li className="w-full h-[40px] flex justify-start items-center" key={file.file_uuid} onClick={()=>handleClickItem(file)}>
                                    <div className=" h-full flex justify-start items-center gap-2 p-4 cursor-pointer">
                                        <Thumbnail type={file.file_type} extension = {extension}/>
                                        <p className="text-sm font-medium line-clamp-1">{file.file_name}</p>
                                    </div>
                                    <div className="text-sm line-clamp-1">
                                        <FormattedDateTime date={file.created_at} className="line-clamp-1 text-sm"/>
                                    </div>
                                </li>
                            )})}
                            </ul>
                        </div>
                    ):( 
                        // if open state is false i.e. no files in response, render paragraph element to inform that
                        <div className="w-[300px] h-auto bg-white border-2 rounded-md flex flex-col justify-center items-center absolute top-[60px] left-[700px] z-10 ">
                            <p className="w-full h-[40px] text-sm flex justify-center items-center">No files found</p>
                        </div>
                    )}
                    </div>
            ):(
                //if isQuery state is false, i.e. searchbar is empty, return nothing
                null
            )}  
        </div>   
    );
};

export default Search;