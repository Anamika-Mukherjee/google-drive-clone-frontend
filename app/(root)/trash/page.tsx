"use client";

import React, {useState, useEffect} from "react";
import Sort from "@/components/Sort";
import axios from "axios";
import TrashCard from "@/components/TrashCard";
import { getFileType, convertFileSize } from "@/lib/utils";
import { TrashFileInfo } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

const Page = () =>{

    const [files, setFiles] = useState<TrashFileInfo[]>([]);
    const [fileSize, setFileSize] = useState<string>("");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    //set isClient to true on the first render of the page
    useEffect(()=>{
        setIsClient(true);
    }, []);

    //display error message when error state changes
    useEffect(()=>{
    if(error){
        toast.error(error);
    }
    }, [error]);

    //function to get trash file data 
    useEffect(()=>{
        if(isClient){
            const getFiles = async () =>{
                try{
                    //retrieve access token from session storage and if token not available, redirect to sign in page
                    const token = sessionStorage.getItem("accessToken");
        
                    if(!token){
                        window.location.href = "/sign-in";
                        throw new Error("User not found!");
                    }

                    //set loading state to true before api request
                    setIsloading(true);

                    //api request to backend to get trash file information
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/trash-list`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
        
                    //throw error if request is unsuccessful
                    if (!response || response.status !== 200) { 
                        const errorMsg = response?.data?.message || "Something went wrong!";
                        throw new Error(errorMsg);
                    }
                   
                    //return response
                    return response;       
                }
                catch(err){
                    //if error is of Error type, set error state with the error message
                    if (err instanceof Error) {
                        //if status code 401, set error state with custom message
                        if(err.message === "Request failed with status code 401"){
                            setError("Invalid Credentials or Unauthorized Access");
                        }
                        else{
                            setError(err.message);
                        }
                    } 
                    //if error is of unknown type, set error state with custom message
                    else {
                    setError("An unexpected error occurred.");
                    }
                }
                finally{
                    //set loading state to false when request processed
                    setIsloading(false);
                }
            };
            //call function to get trash file data 
            getFiles()
            .then((response)=>{
                //set the files state variable with the returned file data
                setFiles(response?.data.files);
            })
            .catch(err=>console.log(err));         
        }
    }, [isClient]);

    //calculate total size of all trash files when file data received
    useEffect(()=>{
        let totalSize = 0;
        if(files && files.length>0){
            files.map((file)=>{
              totalSize += file.file_size;
            })
        }
        let sizeString = convertFileSize(totalSize);
        setFileSize(sizeString);
    }, [files]);

    return(
        <div className="w-full h-full flex flex-col justify-start items-center space-y-3">
            <section className="w-full h-auto flex flex-col justify-start items-start">
                <h1 className="text-xl capitalize mt-4 ml-4 font-semibold">Trash</h1>
                <div className="w-full h-auto flex justify-between items-center">
                    <div className="w-1/4 h-[20] ml-4 mt-2">
                        <p className="text-xs font-semibold">  
                            Total:<span className="ml-1">
                                {fileSize} 
                            </span>
                        </p>
                    </div>
                    <div className="w-1/4 h-[20] hidden lg:flex justify-center items-center">
                        <p className=" sm:block text-gray text-xs font-semibold mr-4">Sort by:</p>
                        <Sort />
                    </div>
                </div>
            </section>
            {/* if page is loading, show loading spinner */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center">
                    <p>Loading...</p>
                    <Image 
                    src = "/assets/icons/loader.svg"
                    alt = "Loader"
                    width={24}
                    height={24}
                    className="mt-4 animate-spin justify-self-center"
                    />
                </div>
            ):
            // if files data available, map the files data array and return each file's data in form of Card
            files?.length > 0? (
                <section className="w-full h-auto flex flex-col justify-start items-center space-y-4 lg:space-y-0 lg:flex-row lg:justify-start lg:items-center lg:flex-wrap">
                 
                   {files.map((file)=>{

                      const {type, extension} = getFileType(file.file_name);
                       return (
                       <TrashCard key={file.id} file = {file} type = {type} extension= {extension}/>
                      )})}
                </section>
             ):
             //if no file data, return a message
             (<p>
                 No files in trash!
             </p>)
             }     
        </div>
    );
}

export default Page;


