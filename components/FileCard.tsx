"use client";

import Link  from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import ActionsDropDown from "./ActionsDropDown";
import { FileInfo } from "@/types";

//component to render file information in card format in dashboard
const FileCard = ({file, type, extension}:{file: FileInfo, type: string, extension: string})=>{

 return(
     <div className="w-[300px] h-[60px] flex justify-between items-center rounded-lg pl-2 hover:bg-gray-100">
        <Link
          href = {file.signedUrl.signedUrl || ""}
          target="_blank"
          className = "w-1/2 font-normal text-xs flex justify-start items-center space-x-2 space-y-1">
                <div className="w-1/4 h-full flex justify-center items-start">
                    <Thumbnail type = {type} extension={extension}/>   
                </div>
                <div className="flex flex-col justify-center items-start space-y-1">
                    <p className="line-clamp-1 font-medium">{file.file_name}</p>
                    <FormattedDateTime date={file.created_at} className = "text-gray-500"/>
                </div>
        </Link>
        <div className="h-full flex flex-col justify-center items-end p-2 text-xs">
            <ActionsDropDown file = {file}/>
        </div>
     </div>
     
 );
};

export default FileCard;