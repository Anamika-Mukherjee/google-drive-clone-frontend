"use client";

import React from "react";
import {usePathname, useRouter} from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";

//component to render sorting functionality
const Sort = () =>{
  
  const router = useRouter();
  const path = usePathname();

  //function to handle sorting parameter selection event
  const handleSort = (value: string)=>{
    //redirect to path with sort text when sorting parameter is changed
    router.push(`${path}?sort=${value}`);
  }

  return(
    <Select onValueChange={handleSort} >
      <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder= {sortTypes[0].label}/>
      </SelectTrigger>
      <SelectContent className="bg-white">
          {sortTypes.map((sort)=>(
            <SelectItem key={sort.label}
              value={sort.value}>{sort.label}</SelectItem>
          ))}
          
          <SelectItem value="edit"></SelectItem> 
      </SelectContent>
    </Select>
  );
};

export default Sort;