
"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";
import Image from "next/image";
import { getFileType, convertFileSize } from "@/lib/utils";
import StorageCard from "@/components/StorageCard";
import TypeCard from "@/components/TypeCard";
import FileCard from "@/components/FileCard";
import { FileInfo } from "@/types";
import { toast } from "sonner";
import { StorageInfo } from "@/types";

export default function Page() {

    const [isClient, setIsClient] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const[allFiles, setAllFiles] = useState<FileInfo[]>([]);
    const [allFileSize, setAllFileSize] = useState<string>("0 MB");
    const [docFileSize, setDocFileSize] = useState<string>("0 MB");
    const [imgFileSize, setImgFileSize] = useState<string>("0 MB");
    const [mediaFileSize, setMediaFileSize] = useState<string>("0 MB");
    const [otherFileSize, setOtherFileSize] = useState<string>("0 MB");
    const [totalFileSize, setTotalFileSize] = useState<number>(0);
  
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

    //function to get all file data   
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

                  //api request to backend to get all file information
                  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/file-list`, {
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
          //call function to get all file data 
          getFiles()
          .then((response)=>{
              //set the allFiles state variable with the returned file data
              setAllFiles(response?.data.files);
          })
          .catch(err=>console.log(err));         
      }
    }, [isClient]);

    //function to get file information on the basis of file type
    useEffect(()=>{
      const getFilesByType = async () =>{
          try{
            //retrieve access token from session storage 
            const token = sessionStorage.getItem("accessToken");
        
            if(!token){
                throw new Error("User not found!");
            }

            //set loading state to true before api request
            setIsloading(true);

            //api request to backend to get file information on the basis of file type
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/storage-usage`, {
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
      };
      //call function to get file type data 
      getFilesByType()
      .then((response)=>{

        //define correct type for returned data
        const storageInfo : StorageInfo[] = response?.data as StorageInfo[];

        //variable to store size of "media" type
        let medSize : number = 0;

        //map the returned data for each file type and set the size state variable for each type with the size data retrieved
        storageInfo.map((usageData)=>{
          if(usageData.file_type === "document"){
              const docSize = convertFileSize(usageData.total_size);
              setDocFileSize(docSize);
          }
          else if(usageData.file_type === "image"){
              const imgSize = convertFileSize(usageData.total_size);
              setImgFileSize(imgSize);
          }
          else if(usageData.file_type === "video" || usageData.file_type === "audio"){
              //for media type, add the size of video and audio file types
              medSize += usageData.total_size;  
          }
          else {
              const otherSize = convertFileSize(usageData.total_size);
              setOtherFileSize(otherSize);
          }
          //get the combined size of video and audio types in mediaSize variable and store it in state variable
          const mediaSize = convertFileSize(medSize);
          setMediaFileSize(mediaSize);
        })
      })
      .catch((err)=>console.log(err));
    }, []);

    //calculate total size of all files when file data received
    useEffect(()=>{
      const getTotalFileSize = ()=>{
        let totalSize = 0;
        if(allFiles && allFiles.length>0){
            allFiles.map((file)=>{
              totalSize += file.file_size;
            })
        }
        setTotalFileSize(totalSize);
        let sizeString = convertFileSize(totalSize);
        setAllFileSize(sizeString);
      };
      getTotalFileSize();          
      }, [allFiles]);
  
    return(
          <div className ="w-full h-full flex flex-col lg:flex-row justify-center items-center " >
              <div className="w-full h-auto lg:w-2/3 lg:h-full flex flex-col justify-around items-center ">
                  <StorageCard totalFileSize= {totalFileSize}/>           
                  <div className="w-full h-auto lg:h-2/3 flex flex-col lg:flex-row justify-evenly items-center lg:flex-wrap">
                    <TypeCard type = "document" size = {docFileSize} url="/documents"/>
                    <TypeCard type = "image" size = {imgFileSize} url="/images"/>
                    <TypeCard type = "media" size = {mediaFileSize} url="/media"/>
                    <TypeCard type = "other" size = {otherFileSize} url="/media"/>
                  </div>
              </div>
              <div className="w-full h-auto lg:w-2/5 lg:h-full lg:overflow-y-auto flex flex-col justify-start items-start space-y-4 m-4 bg-white rounded-xl py-6 px-4">
                    <div className="w-full h-auto flex justify-start items-center">
                      <p className="font-bold text-xl">Recent Files Uploaded</p>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start">  
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
                      // if files data available, map the allFiles data array and return each file's data in form of Card
                      (allFiles.length > 0? allFiles.map((file)=>{
                        const {type, extension}=getFileType(file.file_name);
                        const createdDate = new Date(file.created_at);
                        const currentDate = Date.now();
                        const timeInterval = (currentDate - createdDate.getTime())/(1000 * 3600 *24);
                        if(timeInterval<5){
                          return(
                            <FileCard key = {file.id} file = {file} type={type} extension={extension}/>                 
                          )
                        }
                      }):
                      //if no file data, return a message
                      (<p>
                        No files uploaded!
                      </p>))
                      }
                    </div>
              </div>
          </div>
      );
}







