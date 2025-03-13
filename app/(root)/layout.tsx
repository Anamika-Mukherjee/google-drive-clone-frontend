"use client";

import axios from "axios";
import React, {useState, useEffect} from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { FileInfo } from "@/types";
import { toast } from "sonner";

interface User{
    fullName: string,
    email: string
}

const Layout = ({children}: {children: React.ReactNode}) =>{

    const [isClient, setIsClient] = useState<boolean>(false);
    const [userData, setUserData] = useState<User>({fullName: "", email: ""});
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(()=>{
            setIsClient(true);
    }, []);

    //display error message when error state changes
    useEffect(()=>{
        if(error){
          toast.error(error);
        }
      }, [error]);

   useEffect(()=>{
    if(isClient){
        //retrieve token from session storage
        const token = sessionStorage.getItem("accessToken");
        if(!token){
            window.location.href = "/sign-in";
            throw new Error("Token not available!");
        }

        //function to fetch user data 
        const fetchData = async () =>{

          const res = await getUserData(token);
          if(!res){
            window.location.href = "/sign-in";
            throw new Error("Could not retrieve user data!");
          }

          //store user data
          const data : User = {
            email: res?.data.email,
            fullName: res?.data.full_name
         };
        setUserData(data);
     };
     fetchData();
    }
   }, [isClient]);

    
    const getUserData= async (token: string)=>{
        try{
            //api request to backend to fetch user data
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/dashboard`, {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
            });
    
            //throw error if request is unsuccessful 
            if(!response || response.status !== 200) { 
                const errorMsg = response?.data?.message || "Something went wrong!";
                throw new Error(errorMsg);
            }

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
    }    
  
    return (
        <main className="w-screen lg:h-screen flex justify-center items-center">
                 <Sidebar {...userData}/>
            <section className=" w-full h-full flex flex-col justify-start items-center">
              <MobileNavigation {...userData}/>
              <Header/>

               <div className="w-[80%] lg:h-[4/5] p-4 z-auto lg:overflow-y-auto flex flex-col justify-center items-center relative top-[20px] rounded-2xl bg-peach">
                  {children}
               </div>
            </section>
            <Toaster/>
        </main>
    );

}

export default Layout;