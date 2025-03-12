"use client";

import React, {useState, useEffect} from "react";
import { useParams, useSearchParams} from "next/navigation";
import Sort from "@/components/Sort";
import axios from "axios";
import Card from "@/components/Card";
import { getFileType, convertFileSize } from "@/lib/utils";
import { FileInfo, SharedFileInfo } from "@/types";
import Image from "next/image";
import { toast } from "sonner";

const Page = () =>{
    //extract "type" param from the route
    const {type = "documents"} = useParams();

    //define fileType on the basis of "type" param
    let fileType : string = type as string;

    if(type === "documents"){
        fileType = "document";
    }
    else if(type === "images"){
        fileType = "image";
    }
    else if(type === "media"){
        fileType = "media"
    }
    else{
        fileType = "other";
    }

    //retrieve "sort" params from searchParams
    const searchParams = useSearchParams();
    const sortText = searchParams.get("sort") || "name-asc";

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [fileSize, setFileSize] = useState<string>("");
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    //display error message when error state changes
    useEffect(()=>{
      if(error){
        toast.error(error);
      }
    }, [error]);

    //function to get files when the page loads
    useEffect(()=>{

        const getSortedFiles = async (fileType: string, sortText: string)=>{
            try{
                //retrieve access token from session storage
                const token = sessionStorage.getItem("accessToken");
                if(!token){
                    window.location.href = "/sign-in";
                    throw new Error("Token not available!");
                }

                //declare new formData object and append sorting parameter and file type with it
                const formData = new FormData();

                formData.append("sortBy", sortText);
                formData.append("fileType", fileType);

                //set loading state to true before api call
                setIsloading(true);

                //api request to backend to get files based on the sorting parameters and the file type
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/file-list-type`, formData, {
                   headers: {
                       "Content-Type": "application/json", 
                       "Authorization": `Bearer ${token}`
                   }
               });
              
               //throw error if request is unsuccessful 
               if(!response || response.status !== 200) { 
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
       //call function with file type and sort parameters to get files by type and sort them according to parameters
       getSortedFiles(fileType, sortText)
       .then((response)=>{
        //set the files state variable with the returned file data
         setFiles(response?.data.files);
       })
       .catch((err)=>console.log(err));
    }, [sortText]);

    //calculate total size of all files when file data received
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
                <h1 className="text-xl capitalize mt-4 ml-4 font-semibold">{type}</h1>
                <div className="w-full h-auto flex justify-between items-center">
                    <div className="w-1/4 h-[20px] ml-4 mt-2">
                        <p className="text-xs font-semibold">  
                            Total:<span className="ml-1">
                                {fileSize} 
                            </span>
                        </p>
                    </div>
                    <div className="w-1/3 h-[20px] hidden lg:flex justify-center items-center">
                        <p className="hidden sm:block text-gray text-xs font-semibold mr-4">Sort by:</p>
                        <Sort />
                    </div>
                </div>
            </section>
            <div className="w-full h-full flex flex-col justify-start items-center">
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
                       <Card key={file.id} file = {file} type = {type} extension= {extension}/>
                      )})}
                </section>
             ):
             //if no file data, return a message
             (<p className="flex justify-center items-center">
                 No files uploaded!
             </p>)
             }
            </div>
        </div>
    );
}

export default Page;


