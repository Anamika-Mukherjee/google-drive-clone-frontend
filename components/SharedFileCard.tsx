"use client";

import Link  from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import SharedFileActions from "./SharedFileActions";
import {SharedFileInfo } from "@/types";
import { convertFileSize } from "@/lib/utils";

//component to render shared file information in card format
const SharedFileCard = ({file, type, extension}: {file: SharedFileInfo, type: string, extension: string}) =>{
   
    return(
        <div className="w-[200] h-[200] flex justify-between items-center rounded-xl m-4 bg-white hover:bg-gray-50 shadow-md">
        <Link
        href = {file.signedUrl.signedUrl}
        target="_blank"
        className = "w-full h-full font-normal text-xs flex justify-between items-start">
            <div className="w-1/2 h-full font-normal text-xs flex flex-col justify-start items-start space-y-5 p-4">
            <div className="w-full h-auto flex justify-start items-start">
                <Thumbnail type = {type} extension={extension}/>
                
            </div>
            <div className="flex flex-col justify-center items-start space-y-1">
                 <p className="line-clamp-1 font-medium">{file.file_name}</p>
                 <p className="font-semibold">Shared by: </p>
                 <div className="flex flex-col justify-center items-start">
                    <p>{file.owner_name}</p>
                    <p className="">{file.owner_email}</p>
                 </div>
                 <span className="ml-1"></span>
                 <div className="flex justify-start items-center">
                 <p className="font-semibold">Permission:</p>
                 <span className="ml-1 ">{file.permission_type}</span>
                 </div>
            </div>
            </div>
            <div className="h-1/2 flex flex-col justify-between items-end self-start p-2 text-xs">
                    <SharedFileActions file = {file}/>
                    <p className="mt-2 h-1/2">{convertFileSize(file.file_size)}</p>
                </div>
           </Link>
           
        </div>
        
    );
};

export default SharedFileCard;