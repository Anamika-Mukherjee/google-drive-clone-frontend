"use client";

import React, {FormEvent, useEffect, useState} from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import { formatDateTime } from "@/lib/utils";
import {Input} from "@/components/ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { AccesserInfo, FileInfo } from "@/types";
  
//component to render thumbnail based on the file type
const ImageThumbnail = ({file}: {file: FileInfo}) =>{
     const {type, extension} = getFileType(file.file_name);
    
     return(
    <div className="w-full h-auto flex justify-start items-center gap-3 rounded-lg bg-gray-100 p-2">
       <Thumbnail type = {type} extension={extension} url={file.signedUrl.signedUrl}/>
       <div className="flex flex-col justify-center items-center text-xs">
        <p className="font-semibold">{file.file_name}</p>
        <FormattedDateTime date = {file.created_at} />
       </div>
    </div>
    )
}

//component for "details" action to render rows of file details
const DetailRow = ({label, value}: {label: string, value: string}) =>(
    <div className="w-full flex justify-between items-center text-sm font-semibold px-4">
        <p className="text-gray-500 text-left">{label}</p>
        <p className="text-left ">{value}</p>
    </div>
)

//component to render file details
export const FileDetails = ({file}:{file: FileInfo})=>{
    const {type, extension} = getFileType(file.file_name);
    return(
        <div className="flex flex-col justify-around items-center gap-4">
            <ImageThumbnail file = {file}/>
            <div className="w-full flex flex-col justify-start items-evenly">
                <DetailRow label="Format:" value= {extension}/>
                <DetailRow label="Size:" value= {convertFileSize(file.file_size)}/>
                <DetailRow label="Last Edit:" value= {formatDateTime(file.created_at)}/>
            </div>
        </div>
    );
};

//types for ShareInput component props
interface Props{
    file: FileInfo;
    onInputChange: React.Dispatch<React.SetStateAction<string>>;
    onSelectChange: React.Dispatch<React.SetStateAction<string>>;
    onRemove: (accesserInfo: AccesserInfo) => void;
    accessers: AccesserInfo[] | null;
}

//component to render modal for "share" file action
export const ShareInput = ({file, onInputChange, onSelectChange, onRemove, accessers}: Props) =>{
    return(
          <>
            <ImageThumbnail file = {file}/>
            <div className="w-full h-auto flex flex-col justify-center items-start space-y-4">
                <p className="text-sm text-left font-medium text-gray-dark">Share file with other users</p>
              
                <Input
                 type="email"
                 placeholder="Enter email address"
                 onChange={(e)=>onInputChange(e.target.value)}
                 className="h-[30px] w-full flex"
                />
                <div className="w-full flex flex-col justify-center items-start">
                    <p className="text-sm font-semibold mb-2 text-gray-dark">People with access</p>
                    <div className="w-full flex justify-between items-center">
                        <ul className="w-full h-auto flex flex-col justify-evenly items-start flex-wrap px-2">
                        {accessers && accessers.map((accesser, index)=>(
                            <li key={index} className="w-full h-auto text-wrap text-sm mr-2 flex justify-center items-center">
                                <p className="w-full line-clamp-1">{accesser.accesser_email}</p>
                                <p className="mr-2 text-xs font-semibold">
                                 {accesser.permission_type === "view" && (
                                    "Viewer"
                                 )}
                                 {accesser.permission_type === "edit" && (
                                    "Editor"
                                 )}
                                 </p>
                                 
                                <Button className="w-[24px] h-[24px] p-0 bg-white hover:bg-white border-none shadow-none" onClick={()=>onRemove(accesser)}>
                                   <Image
                                    src="/assets/icons/remove.svg"
                                    alt="remove"
                                    width={24}
                                    height={24}/>
                                </Button>
                                </li>
                        ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-dark">Permissions</p>
                    <div>
                    <Select onValueChange={(value)=>onSelectChange(value)}>
                        <SelectTrigger className="w-[180px] h-[30px]">
                            <SelectValue placeholder="Select Permission Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="view">View</SelectItem>
                            <SelectItem value="edit">Edit</SelectItem> 
                        </SelectContent>
                    </Select>
                    </div>
                </div>
            </div>
        </>
    );
};



