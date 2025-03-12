"use client";

import axios from "axios";
import React, {useState, useEffect, FormEvent} from "react";
import Image from "next/image";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import {usePathname} from "next/navigation";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { toast } from "sonner";

  
interface Props{
    fullName: string,
    email: string
}

//component to render navigation bar for mobile devices
const MobileNavigation = ({fullName, email}: Props) =>{
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const pathname = usePathname();

    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    //function to sign out user
    const signOut = async ()=>{
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

    return (
        <header className="w-full flex justify-between items-center lg:hidden">
            <div className="w-[50] h-[40] bg-brand p-2 rounded-2xl lg:hidden flex justify-center items-center mt-2 ml-4">
                <Image 
                    src="/logo.png"
                    alt="logo"
                    width={30}
                    height={30}
                />
            </div>
            <Sheet open = {open} onOpenChange={setOpen}>
                <SheetTrigger className="mr-4">
                    <Image 
                    src="/assets/icons/menu.svg"
                    alt="menu"
                    width = {40}
                    height = {40}
                    />
                </SheetTrigger>
                <SheetContent className="lg:hidden bg-violet-light min-h-screen">  
                    <SheetTitle>
                        <div className="w-full h-[40] flex justify-start space-x-4 items-center">
                            <Image 
                                src={avatarPlaceholderUrl}
                                alt="avatar"
                                width={40}
                                height={40}
                                className="rounded-3xl"
                            />
                            <div className="sm:hidden lg:flex flex-col justify-center space-y-1 items-center">
                                <p className="subtitle">{fullName}</p>
                                <p className="caption text-gray-dark">{email}</p>
                            </div>
                        </div>
                        <Separator className="mb-2 bg-violet-light"/>
                    </SheetTitle>
                    <nav className="mobile-nav">
                        <ul className="mobile-nav-list">
                            {/* map each navItem to display the link for navbar items */}
                            {navItems.map(({url, name, icon})=>(
                                <Link key={name} href = {url} className="w-full">
                                    <li className ={pathname === url? "mobile-nav-active":"mobile-nav-item"}>                        
                                        <Image
                                            src={icon}
                                            alt={name}
                                            width={24}
                                            height={24}
                                            className="hidden lg:block"
                                        />
                                        <Image
                                            src={icon}
                                            alt={name}
                                            width={40}
                                            height={40}
                                            className="block lg:hidden"
                                        />
                                        <p>{name}</p> 
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>

                    <Separator className="mb-10 bg-violet-light"/>

                    <div className="flex flex-col justify-between space-y-5 pb-5">
                        <FileUploader />
                        <Button 
                        type="submit" 
                        className = "bg-peach hover:bg-peach-dark"
                        onClick={handleClick}
                        >
                            <Image
                                src="/assets/icons/logout.svg"
                                alt="logout"
                                width = {24}
                                height = {24}
                            />
                            <p className="text-gray">Sign Out</p>
                        </Button>
                    </div>
                </SheetContent>
        </Sheet>

        </header>
        
    );
};

export default MobileNavigation;