"use client";

import React, {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDetails, ShareInput } from "./ActionsModalContent";
import { AccesserInfo, ActionType, FileInfo } from "@/types";
import { toast } from "sonner";

//component for file actions
const ActionsDropDown = ({file}: {file: FileInfo})=>{

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState<string>(file.file_name);
    const [email, setEmail] = useState<string>("");
    const [permission, setPermission] = useState<string>("");
    const [accesserList, setAccesserList] = useState<AccesserInfo[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    //function to get the accesser list for shared files from backend
    useEffect(()=>{
       const fetchAccesserList = async () =>{
            try{
                //retrieve access token from session storage 
                const token = sessionStorage.getItem("accessToken");

                if(!token){
                throw new Error("Token not available!");
                }

                //declare formData object and append the file id with it
                const formData = new FormData();
                formData.append("fileId", file.file_uuid);

                //set loading state to true before api request
                setIsLoading(true);

                //api call to backend to get accesser list
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/accesser-list`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                //throw error if request is unsuccessful
                if (!response || response.status !== 200) { 
                    const errorMsg = response?.data?.message || "Something went wrong!";
                    throw new Error(errorMsg);
                }

                //store email list received with the response in accesserList state variable
                setAccesserList(response.data.accesserList);       
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
                setIsLoading(false);
            }
        };
       //call function to retrieve accesser list
       fetchAccesserList();  
    }, []);

    //function to close all modals and reset all state variables
    const closeAllModals = ()=>{
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.file_name);
    }

    //function to rename file
    const renameFile = async (token: string) =>{
        try{
            //declare formData object and append current file name and new file name with it
            const formData = new FormData();
            formData.append("oldFileName", file.file_name);
            formData.append("newFileName", name);

            //set loading state to true before api request
            setIsLoading(true);

            //api call to backend to rename file
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/file-rename`, formData, {
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

            //set new file name as the file name
            file.file_name = response.data.newFileName;

            //display message after renaming file
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
        setIsLoading(false);
       }
    }

    //function to move file to trash 
    const trashFile = async (token: string) =>{
        try{
            //declare formData object and append file name with it
            const formData = new FormData();
            formData.append("fileName", file.file_name);

            //set loading state to true before api request
            setIsLoading(true);

            //api request to backend to move file to trash
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/file-trash`, formData, {
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

            //display message after moving to trash
            toast(response.data);

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
        setIsLoading(false);
       }
    }

    //function to share file
    const shareFile = async (token: string) =>{
        try{
            //declare formData object and append file name, accesser email and access permission type
            const formData = new FormData();
            
            formData.append("fileName", file.file_name);
            formData.append("accesserEmail", email);
            formData.append("permissionType", permission);

            //set loading state to true before api request
            setIsLoading(true);

            //api request to backend to add accesser's email to the accesser list for the file
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/add-accesser`, formData, {
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
             
            //store accesser emails received from backend into accesserList state variable
            setAccesserList(response.data.accesserList);

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
        setIsLoading(false);
       }
    }

    //function to handle rename, share, delete file actions
    const handleAction = async ()=>{
        try{
            //return if action state is empty
            if(!action) return;

            //define variable to store success status of file actions
            let success : boolean | undefined = false;            

            //retrieve access token from session storage and redirect to sign in page if not available
            const token = sessionStorage.getItem("accessToken");
        
            if(!token){
                window.location.href = "/sign-in";
                throw new Error("User not found!");
            }

            //define object that calls functions corresponding to the file actions
            const actions = {
                "rename": () => renameFile(token),
                "share": () => shareFile(token),
                "moveToTrash": () => trashFile(token)
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
        finally{
            //set loading state to false when request is processed
            setIsLoading(false);
        }
    }

    //function to remove accesser from accesser list
    const handleRemoveAccesser = async (accesser: AccesserInfo)=>{
        try{
            //retrieve access token from session storage and redirect to sign in page if not available
            const token = sessionStorage.getItem("accessToken");
        
            if(!token){
                window.location.href = "/sign-in";
                throw new Error("User not found!");
            }

            //declare formData and append file name and accesser email with it
            const formData = new FormData();
            
            formData.append("fileName", file.file_name);
            formData.append("accesserEmail", accesser.accesser_email);

            //set loading state to true before api request
            setIsLoading(true);

            //api request to remove accesser from the accesser list
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/remove-accesser`, formData, {
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
             
            //store the updated accesser list received from backend into the accesserList state variable
            setAccesserList(response?.data.accesserList);

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
        setIsLoading(false);
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
                    {/* render input element to rename file if the action value is "rename" */}
                    {value === "rename" && (
                       <Input 
                        type="text"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}/>
                    )}
                    {/* render FileDetails component if action value is "details" */}
                    {value === "details" && (
                        <FileDetails file={file}/>
                    )}
                    {/* render ShareInput component if action value is "share" */}
                    {value === "share" && (
                        <ShareInput file={file} onInputChange = {setEmail} onSelectChange={setPermission} onRemove = {handleRemoveAccesser} accessers = {accesserList}/>
                    )}
                    {/* render confirmation message if action value is "moveToTrash" */}
                    {value === "moveToTrash" && (
                       <p className="text-sm ml-4">Are you sure you want to delete{` `}
                       <span>{file.file_name}</span>?
                       </p>
                    )}
                </DialogHeader>
                {/* render buttons for cancel and action for rename, moveToTrash and share action values */}
                {["rename", "moveToTrash", "share"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button 
                        onClick={closeAllModals}
                        className="w-full">
                           Cancel
                        </Button>
                        <Button 
                          onClick={handleAction}
                          className="bg-violet hover:bg-violet-dark w-full">
                            {value === "moveToTrash"?(
                                <p>Move file to Trash</p>
                            ):(
                                <p className="capitalize">{value}</p>
                            )}
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
        {/* dropdown menu for file actions like rename, share, etc*/}
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
                {/* map through the actionsDropdownItems array to set action state for each action value when it is clicked */}
                { actionsDropdownItems.map((actionItem)=>(
                   <DropdownMenuItem
                    key={actionItem.value}
                    className="w-full flex justify-center items-center"
                    onClick={()=>{
                        setAction(actionItem);
                        if(["rename", "share", "details", "moveToTrash"].includes(actionItem.value)){
                            setIsModalOpen(true);
                        }
                    }}>
                    {/* if action is "download", make the dropdown item a link element to download the file */}
                    {actionItem.value === "download" ? (
                        <Link href={file.signedUrl.signedUrl}
                        className="min-w-full flex justify-start items-center gap-5 hover:cursor-pointer">
                          <Image 
                           src={actionItem.icon}
                           alt={actionItem.label}
                           width={24}
                           height={24}
                          />
                          {actionItem.label}
                        </Link>
                    ):
                    // for other actions, make the dropdown item a normal div element
                    (
                        <div className="min-w-full flex justify-start items-center gap-5 hover:cursor-pointer">
                            <Image 
                           src={actionItem.icon}
                           alt={actionItem.label}
                           width={24}
                           height={24}
                          />
                          {actionItem.label}
                        </div>
                    )
                    }
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

export default ActionsDropDown;