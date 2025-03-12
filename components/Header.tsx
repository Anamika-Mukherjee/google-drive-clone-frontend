"use client";
import axios from "axios";
import React, { useState, useEffect, FormEvent } from "react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { toast } from "sonner";
import BreadCrumbs from "@/components/BreadCrumbs";


//component for header in page layout
const Header = () =>{

    const [isClient, setIsClient] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    //set isClient to true on the first render of the page  
    useEffect(() => {
        setIsClient(true);
    }, []);

    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    //return null if it's not client side rendering
    if (!isClient) {
        return null;
    }

    //function to sign out user
    const signOut= async ()=>{
        try{

            //set loading state to true before api request
            setIsLoading(true);

            //api request to backend to sign out user
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
                headers: {
                "Content-Type": "application/json"
                }
            });

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
            //set loading state to false when request processed
            setIsLoading(false);
        }
    };

    //function to handle click event for signout button    
    const handleClick = async (e: FormEvent) =>{
        e.preventDefault();
            
            //call signout() function and if response received, remove access token from session storage and redirect to sign in page
            const res = await signOut();
            if(res){
                sessionStorage.removeItem("accessToken");
                window.location.href = "/sign-in";
            }       
    }

    //if page is loading, display loading message and spinner
    if(isLoading){
        return(
            <div>
              <p>Signing out...</p>
              <Image 
                src = "/assets/icons/loader.svg"
                alt = "Loader"
                width={24}
                height={24}
                className="mt-4 animate-spin justify-self-center"
              />
            </div>
        );   
    }

    return(
        <header className=" hidden w-full h-[80px] lg:flex justify-between items-center w-full p-4 space-x-4"> 
            <BreadCrumbs />
            <div className="hidden lg:flex justify-between items-center w-full p-4">
                <Search />
            <div className="flex justify-evenly items-center">
                 <FileUploader/>
                   <form onSubmit={(e: FormEvent)=> e.preventDefault()}>
                    <Button 
                     type="button" 
                     className = "bg-peach hover:bg-peach-dark rounded-3xl"
                     onClick={handleClick}
                    >
                        <Image
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        width = {20}
                        height = {20}
                        />
                    </Button>
                    </form>
            </div>
            </div>
        </header>
    );
};

export default Header;