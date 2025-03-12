"use client";

import axios from "axios";
import React,{useCallback, useState, useEffect} from "react";
import {useDropzone} from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { getFileType, convertFileToUrl } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";

interface UploadFileProps{
  file: File,
  type: string,
  token: string
}

//component to render file upload functionality
const FileUploader = () =>{

    const [files, setFiles] = useState<File[]>([]);
    const [type, setType] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    //function to upload file 
    const uploadFile = async ({file, type, token}: UploadFileProps) =>{
      try{

        //declare new formData object and append file name and file type with it
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("fileType", type);
  
        //set loading state to true before api request
        setIsLoading(true);

        //api request to backend to upload file
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/file-upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
        })
  
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
        //set loading state to false when request is processed
        setIsLoading(false);
      }
    }

    //function to remove file from the upload list
    const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) =>{
        //stop the uploading of file when function is called
        e.stopPropagation();

        //set the files state variable with all files except the file to be removed
        setFiles((prevFiles)=>prevFiles.filter((file)=>
            file.name !== fileName));
    }

    //function to execute upload process when file is dragged and dropped or selected from local storage
    const onDrop = useCallback(async (acceptedFiles: File[]) => {

      //store all the files to be uploaded into the files state variable 
      setFiles(acceptedFiles);

      //retrieve access token from session storage 
      const token = sessionStorage.getItem("accessToken");

      if(!token){
      throw new Error("No token available!");
      }

      //map each file to be uploaded; call function to upload each file and store the promises returned
      const uploadPromises = acceptedFiles.map(async (file)=>{

        //get the type of file and store it in a state variable
        const {type} = getFileType(file.name);
        setType(type);

        //if file size exceeds max file size to be uploaded, return with a message; continue uploading other files
         if(file.size > MAX_FILE_SIZE){
            setFiles((prevFiles)=> prevFiles.filter((f)=>
            f.name !== file.name));
            return toast((
              <p>
              <span className="mr-1 font-semibold">{file.name}</span>
              is too large! Maximum file size is 50MB.
              </p>
          ))
         }
         
         //call uploadFile() function to upload files one at a time
         const res = await uploadFile({file, type, token});

         if(res){
            //if response received, remove the file from the upload list keeping other files
            setFiles((prevFiles)=> prevFiles.filter((f)=>
              f.name !== file.name));
  
            //display message after successful upload 
            toast(res?.data.message);
         }        
       })

       //resolve all the promises returned by the file upload process
       await Promise.all(uploadPromises);

      }, [])
      
    //destructure methods from react-dropzone hook  
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    
      return (
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <Button
            type="button"
             className="bg-brand hover:bg-brand-dark rounded-3xl lg:mr-4">
           <Image 
             src="/assets/icons/upload.svg"
             alt="upload"
             width={24}
             height={24}
             />
             <p>Upload</p>
          </Button>
          {/* if files state is non-empty, map through all the files and display them with file name and thumbnail in the upload list */}
          {files.length > 0 && (
            <ul className="w-auto min-w-[250] z-10 h-auto mt-10 p-4 absolute right-[100] top-[900] flex flex-col justify-center items-start rounded-md bg-gray-light lg:absolute lg:right-[50] lg:top-[30]">
                <h4 className="text-center mb-4">Uploading</h4>
                {files.map((file, index)=>{
                  const {type, extension} = getFileType(file.name);
                 

                  return (
                    <li key = {`${file.name}-${index}`} className="w-full h-auto flex justify-between items-center bg-white p-4 rounded-md mb-4">
                        <div className="flex justify-center items-center space-x-3">
                            <Thumbnail
                              type = {type} 
                              extension = {extension}
                              url = {convertFileToUrl(file)}
                            />
                            
                            <div>
                                {file.name}
                                <Image 
                                 src = "/assets/icons/file-loader.gif"
                                 alt = "file loader"
                                 width = {30}
                                 height = {30}
                                 />
                            </div>
                        </div>

                        <Image
                        src = "/assets/icons/remove.svg"
                        alt="Remove"
                        width={24}
                        height={24}
                        onClick = {(e)=> handleRemoveFile(e, file.name)}
                        />
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      )
};

export default FileUploader;