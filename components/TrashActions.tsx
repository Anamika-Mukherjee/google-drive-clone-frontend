"use client";

import React, {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { trashFileActions } from "@/constants";  
import { Button } from "@/components/ui/button";
import { ActionType, TrashFileInfo } from "@/types";
import { toast } from "sonner";

//component for file actions for trash files
const TrashActions = ({file}: {file: TrashFileInfo})=>{

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    //function to close all modals 
    const closeAllModals = ()=>{
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
    }

    //function to restore file to its original directory
    const restoreFile = async (token: string) =>{
        try{
            //declare formData object and append file name with it
            const formData = new FormData();
            formData.append("fileName", file.file_name);

            //set loading state to true before api request
            setIsloading(true);

            //api request to backend to restore file
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/file-restore`, formData, {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            //throw error if request is unsuccessful
            if (!response || response.status !== 200) { 
                const errorMsg = response?.data?.message || "Something went wrong!";
                throw new Error(errorMsg);
            }

            //display message if request is successful
            toast(response.data.message);

            return true;
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
        //set loading state to false when request is processed
        setIsloading(false);
       }
    };

    //function to permanently delete file
    const deleteFile = async (token: string) =>{
        try{
            //declare formData object and append file name with it
            const formData = new FormData();
            formData.append("fileName", file.file_name);

            //set loading state to true before api request
            setIsloading(true);

            //api request to backend to permanently delete file
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/file-delete`, formData, {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            //throw error if request is unsuccessful
            if (!response || response.status !== 200) { 
                const errorMsg = response?.data?.message || "Something went wrong!";
                throw new Error(errorMsg);
            }

            //display message if request is successful
            toast(response?.data.message);
            
            return true;
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
        //set loading state to false when request is processed
        setIsloading(false);
       }
    };  

    //function to handle file action
    const handleAction = async ()=>{
        try{
            //return if action state is empty 
            if(!action) return;

            //define variable to store success status for the action
            let success : boolean | undefined = false;            

            //check for access token in the session storage and redirect to sign in page if token not available
            const token = sessionStorage.getItem("accessToken");
        
            if(!token){
                window.location.href = "/sign-in";
                throw new Error("User not found!");
            }

            //define object that calls functions corresponding to the file actions
            const actions = {
               "restore": ()=> restoreFile(token),
                "delete": () => deleteFile(token)
            };

            //store the returned value in success variable
            success = await actions[action.value as keyof typeof actions]()
            
            //close all modals and reset all state variables if the file action is successful
            if(success){
                closeAllModals();
            }
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

    //function to render dialog box after an action is selected from dropdown menu
    const renderDialogContent = ()=>{
        //return if action state is empty
        if(!action) return null;

        //destructure value and label properties of action object
        const {value, label} = action;

        return(
            <DialogContent className="w-[300px] h-auto rounded-2xl">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center">
                        {label}
                    </DialogTitle>
                    {/* display prompt message if value is "restore" */}
                    {value === "restore" && (
                       <p className="text-sm ml-4">Do you want to restore{` `}
                       <span>{file.file_name}</span>?
                       </p>
                    )}
                    {/* display confirmation message if value is "delete" */}
                    {value === "delete" && (
                       <p className="text-sm ml-4">Do you want to delete{` `}<span>{file.file_name}</span> permanently? 
                       </p>
                    )}

                </DialogHeader>
                {/* render buttons for cancel and action */}
                {["delete", "restore"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button 
                        onClick={closeAllModals}
                        className="w-full">
                           Cancel
                        </Button>
                        <Button 
                          onClick={handleAction}
                          className="bg-violet hover:bg-violet-dark w-full">
                           <p className="capitalize">{value}</p>
                           {isLoading && (
                            <Image 
                             src = "/assets/icons/loader.svg"
                             alt = "Loader"
                             width={10}
                             height={10}
                             className="animate-spin justify-self-center"
                             />
                           )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }
    return(
    <Dialog open = {isModalOpen} onOpenChange={setIsModalOpen}>
         {/* dropdown menu for file actions */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger className="h-1/2 focus:outline-none">
                <Image 
                  src = "/assets/icons/dots.svg"
                  alt="dots"
                  width={20}
                  height={20}
                  />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                <DropdownMenuLabel className="w-[150px] truncate">{file.file_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* map through the trashFileActions array to set action state for each action value when it is clicked */}
                { trashFileActions.map((actionItem)=>(
                   <DropdownMenuItem
                    key={actionItem.value}
                    className="w-full flex justify-center items-center"
                    onClick={()=>{
                        setAction(actionItem);
                        {setIsModalOpen(true);}
                    }}>
                        <div className="min-w-full flex justify-start items-center gap-5 hover:cursor-pointer">
                            <Image 
                           src={actionItem.icon}
                           alt={actionItem.label}
                           width={24}
                           height={24}
                          />
                          {actionItem.label}
                        </div>        
                   </DropdownMenuItem>
                ))
               }
            </DropdownMenuContent>
        </DropdownMenu>
        
         {/* call function renderDialogContent() after rendering the dropdown menu */}
         {renderDialogContent()}
    </Dialog>

    );
};

export default TrashActions;