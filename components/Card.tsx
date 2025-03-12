"use client";

import Link  from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionsDropDown from "./ActionsDropDown";
import { FileInfo, SharedFileInfo } from "@/types";

//component to render file information in card format
const Card = ({file, type, extension}: {file: FileInfo, type: string, extension: string}) =>{

    return(
        <div className="w-[200px] h-[150px] flex justify-between items-center rounded-xl m-4 bg-white hover:bg-gray-50 shadow-md">
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
                 <FormattedDateTime date={file.created_at} className = "text-gray-500"/>
            </div>
            </div>
            <div className="h-1/2 flex flex-col justify-between items-end self-start p-2 text-xs">
                    <ActionsDropDown file = {file}/>

                    <p className="mt-2 h-1/2">{convertFileSize(file.file_size)}</p>
            </div>  
           </Link>
           
           </div>
        
    );
};

export default Card;