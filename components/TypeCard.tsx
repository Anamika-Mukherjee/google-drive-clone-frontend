"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";

//component to display file types and file data grouped by types in card format
const TypeCard = ({type, size, url}: {type: string, size: string, url: string})=>{    
    return(
        <>    
          <Link 
          href = {url}
          className="w-[200px] h-[150px] flex flex-col justify-start items-between bg-white m-4 rounded-[20px] font-semibold text-sm shadow-lg transition-transform duration-150 hover:scale-95"
          >
            <div className="w-full h-[50px] flex justify-between items-start">
            
              {type === "document" &&
              <div className="bg-orange w-[50px] h-[50px] rounded-[60px] flex justify-center items-center">
                <Image 
                  src = "/assets/icons/documents.svg"
                  alt = "document"
                  width = {30}
                  height = {30}
                />
              </div>
              }               
              {type === "image" &&
              <div className="bg-skyblue w-[50px] h-[50px] rounded-[60px] flex justify-center items-center">
                <Image 
                  src = "/assets/icons/images.svg"
                  alt = "image"
                  width = {30}
                  height = {30}
                />
              </div>
              }         
              {(type === "media") &&
              <div className="bg-seagreen w-[50px] h-[50px] rounded-[60px] flex justify-center items-center">
                <Image 
                  src = "/assets/icons/video.svg"
                  alt = "video"
                  width = {30}
                  height = {30}
                />
              </div>
              } 
              {type === "other" &&
              <div className="bg-purple w-[50px] h-[50px] rounded-[60px] flex justify-center items-center">
                <Image 
                  src = "/assets/icons/others.svg"
                  alt = "other"
                  width = {30}
                  height = {30}
                />
              </div>
              }
              <div className=" flex flex-col justify-around items-center bg-white rounded-lg">
                  <p className="mr-3 mt-1 text-xs font-normal text-gray-500">{size}</p>
              </div>
            </div>
            <div className="w-full h-1/3 flex flex-col justify-start items-center space-y-3">
              <div className=" flex justify-center item-center">
                <p>
                  {type === "document" && "Documents"}
                  {type === "image" && "Images"}
                  {type === "media" && "Media"}
                  {type === "other" && "Others"}
                </p>
              </div>
              <Separator className="w-2/3 self-center"/>
              <div className="w-full h-auto flex flex-col justify-center items-center space-y-2">
                <p className="text-gray-500 text-xs text-center">
                  {type === "document" && (
                    "All pdfs, docs, excel sheets and more..."
                  )}
                  {type === "image" && (
                    "All jpgs, pngs, svgs and more..."
                  )}
                  {type === "media" && (
                    "All mp3s, mp4s, avis and more..."
                  )}
                  {type === "other" && (
                    "Miscellaneous files"
                  )}
                </p>
              </div>
            </div>
          </Link>   
        </>
    );
}

export default TypeCard;