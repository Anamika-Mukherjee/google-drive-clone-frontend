"use client";

import React from "react";
import Thumbnail from "./Thumbnail";
import { getFileType } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import { SharedFileInfo } from "@/types";

//component to render thumbnail based on the file type
const ImageThumbnail = ({file}: {file: SharedFileInfo}) =>{
     const {type, extension} = getFileType(file.file_name);
    
     return(
    <div className="w-full h-auto flex justify-start items-center gap-3 rounded-lg bg-gray-100 p-2">
       <Thumbnail type = {type} extension={extension} url={file.signedUrl.signedUrl}/>
       <div className="flex flex-col justify-center items-center text-xs">
        <p className="font-semibold">{file.file_name}</p>
       </div>
    </div>
    )
}

//component for "details" action to render rows of file details
const DetailRow = ({label, value}: {label: string, value: string}) =>(
    <div className="w-full flex justify-between items-center text-sm font-semibold px-4">
        <p className="text-gray-500 text-left">{label}</p>
        <p className="text-left">{value}</p>
    </div>
)

//component to render shared file details
export const SharedFileDetails = ({file}:{file: SharedFileInfo})=>{
    const {extension} = getFileType(file.file_name);
    return(
        <div className="flex flex-col justify-around items-center gap-4">
            <ImageThumbnail file = {file}/>
            <div className="w-full flex flex-col justify-start items-evenly">
                <DetailRow label="Format:" value= {extension}/>
                <DetailRow label="Shared at:" value= {formatDateTime(file.accesser_added_at)}/>
                <DetailRow label="Permission:" value= {file.permission_type}/>
                <DetailRow label="Owned by:" value= {file.owner_email}/>  
            </div>
        </div>
    );
};







