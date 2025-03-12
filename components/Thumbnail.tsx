import React from "react";
import Image from "next/image";
import { getFileIcon } from "@/lib/utils";

interface Props{
  type: string,
  extension: string,
  url?: string
}

//component to render thumbnail for files based on file type
const Thumbnail = ({type, extension, url = ""}: Props) =>{

    return(
        <figure className="w-[30px] h-[30px] rounded-[60px] bg-peach flex justify-center items-center">
            <Image 
             src = {getFileIcon(extension, type)}
             alt = "thumbnail"
             width = {20}
             height = {20}
             />
        </figure>
    );
};

export default Thumbnail;