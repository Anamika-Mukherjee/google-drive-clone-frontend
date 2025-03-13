"use client";

import React, {useState, useEffect, useCallback} from "react";
import {useDropzone} from "react-dropzone";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { sharedFileActions, MAX_FILE_SIZE } from "@/constants";  
import { Button } from "@/components/ui/button";
import { SharedFileDetails} from "./SharedFileModal";
import { AccesserInfo, ActionType, SharedFileInfo } from "@/types";
import { toast } from "sonner";

//component for file actions for shared files
const SharedFileActions = ({file}: {file: SharedFileInfo})=>{

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadPath, setUploadPath] = useState<string>("");
    const [uploadToken, setUploadToken] = useState<string>("");
    const [fileToUpload, setFileToUpload] = useState<File[] | null>(null);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [accesserList, setAccesserList] = useState<AccesserInfo[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [permissionType, setPermissionType] = useState<string>("");

    //display error message when error state changes
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    }, [error]);

    useEffect(()=>{
        //function to get user information to check for permission type
        const getUserData= async ()=>{
            try{
                //retrieve access token from session storage
                const token = sessionStorage.getItem("accessToken");
                if(!token){
                    window.location.href = "/sign-in";
                }

                //api request to backend to retrieve user id
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/dashboard`, {
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                    },
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
        };
        getUserData()
        .then((response)=>{
           //store user id in state variable 
           setUserId(response?.data.user_id);
        })
        .catch((err)=>console.log(err));   
    }, []);

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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/accesser-list`, formData, {
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

                //store accesser list received with the response in accesserList state variable
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
    }, [])

    //store accesser permission type in state variable
    useEffect(()=>{
            accesserList.map((accesserData)=>{
                if(accesserData.accesser_id === userId){
                    setPermissionType(accesserData.permission_type)
                }
            })       
    }, [accesserList, userId]);

    //function to close all modals 
    const closeAllModals = ()=>{
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);    
        setIsUpload(false); 
    }

    //function to upload edited file
    const uploadFile = async ({file, token}: {file: File, token: string}) =>{
        try{
           //attach file to be uploaded and path and token provided by supabase to formData 
           const formData = new FormData();
           formData.append("file", file, file.name);
           formData.append("path", uploadPath);
           formData.append("token", uploadToken);
    
           //set loading state to true before api request
           setIsLoading(true);

           //api request to backend for uploading edited file
           const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/upload-edit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
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
            //set loading state to false when request is processed
            setIsLoading(false);
        }
    }

    //function to execute upload process when file is dragged and dropped or selected from local storage
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        //store the file to be uploaded in state variable
        setFileToUpload(acceptedFiles);
    
        //retrieve access token from sessionStorage for authentication
        const token = sessionStorage.getItem("accessToken");
    
        if(!token){
            throw new Error("No token available!");
        }
    
        //define an object for promises returned by file upload request
        const uploadPromises = acceptedFiles.map(async (file)=>{
    
            //return with a message if file size exceeds maximum limit 
            if(file.size > MAX_FILE_SIZE){
                return toast((
                    <p>
                    <span className="mr-1 font-semibold">{file.name}</span>
                    is too large! Maximum file size is 50MB.
                    </p>
                ))
            }
            
            //call function to upload file when both upload path and upload token are available
            if(uploadPath && uploadToken){
                const res = await uploadFile({file, token});

                //close all dialog boxes when response received
                if(res){
                    setFileToUpload(null);
                    closeAllModals();
                    toast(res.data.message);
                }
            }
        })
              
        //resolve all the promises returned by the file upload process
        await Promise.all(uploadPromises);
         
    }, [uploadPath, uploadToken]);
       
    //destructure methods from react-dropzone hook  
    const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: false})

    //function to edit file 
    const editFile = async (token: string)=>{
        try{
           //attach file name and owner id to formData to send with request 
           const formData = new FormData();
           formData.append("fileName", file.file_name);
           formData.append("owner_id", file.owner_id);

           //set loading state to true before api request
           setIsLoading(true);

           //api request to backend to receive upload url
           const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/edit-file`, formData, {
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
            
            //store the response in object and store upload path and token sent with the response in state variables
            const data = response.data.signedUploadUrl;
            setUploadPath(data.path);
            setUploadToken(data.token);

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

    //function to handle edit file action 
    const handleAction = async ()=>{
        try{
            //return if action state is null
            if(!action) return;

            //define variable to store success status for the action
            let success : boolean | undefined = false;            

            //check for access token in the session storage and redirect to sign in page if token not available 
            const token = sessionStorage.getItem("accessToken");
        
            if(!token){
                window.location.href = "/sign-in";
                throw new Error("User not found!");
            }

            //call function editFile() and store the return value in "success" variable
            success = await editFile(token);
            
            //if success is true, set isUpload state to true so that user can upload file
            if(success){
                setIsUpload(true);
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

    //function to remove file from the upload list
    const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) =>{
        //stop the uploading of file when function is called
        e.stopPropagation();

        //set the fileToUpload state to null and isUpload to false 
        setFileToUpload(null);
        setIsUpload(false);
    }

    //function to render dialog box to upload file
    const renderUploadDialog = ()=>{
        //return if action state is empty
        if(!action) return;
     
        //if isUpload state is true, render upload dialog box
        if(isUpload){
            return(           
                <DialogContent className="w-[300px] h-auto rounded-2xl">
                    <DialogHeader className="flex flex-col gap-3">
                        <DialogTitle className="text-center text-base">
                            Upload file from your device to replace this file
                        </DialogTitle>                 
                    </DialogHeader>
                    <DialogFooter className="w-full flex flex-col justify-center items-center space-y-3 lg:flex-row lg:justify-center lg:space-y-0 lg:space-x-3">
                        <Button
                         onClick={closeAllModals}
                         className="w-full lg:w-[100px] lg:h-full">
                            Cancel
                        </Button>
                        <div {...getRootProps()} className="w-full lg:w-[100px] cursor-pointer flex justify-center items-center">
                            <input {...getInputProps()} className="w-full"/>
                            <Button
                             type="button"
                             className=" w-full lg:w-[100px] lg:h-full bg-violet hover:bg-violet-dark"
                            >
                                <p>Upload</p>
                            </Button>
                            {(fileToUpload && fileToUpload.length > 0) && (
                            <div className="w-[500px] h-auto flex flex-col justify-between items-center absolute top-[200px] left-[150px] bg-white rounded-xl p-4">
                                <h4 className="text-center mb-4">Uploading</h4>
                                <div className="w-full h-auto flex justify-between items-center">
                                <div className="flex justify-center items-center space-x-3">
                                    <div>
                                        {fileToUpload[0].name}
                                        <Image 
                                        src = "/assets/icons/file-loader.gif"
                                        alt = "file loader"
                                        width = {30}
                                        height = {30}
                                        />
                                    </div>
                                </div> 
                                <Image
                                src = "/assets/icons/remove.svg"
                                alt="Remove"
                                width={24}
                                height={24}
                                onClick = {(e)=> handleRemoveFile(e, file.file_name)}
                                />
                                </div>
                            </div>    
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            )
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
                     {/* render SharedFileDetails component if action value is "details" */}
                    {value === "details" && (
                        <SharedFileDetails file={file}/>
                    )}
                    {/* display prompt message to edit file if value is "edit" */}
                    {value === "edit" && (
                         <p className="text-sm text-justify"> Click the edit button to upload a new file.
                          The contents of this file will be substituted with the new file contents.</p>                      
                    )}
                </DialogHeader>
                {/* render buttons for cancel and action for edit action */}
                {value === "edit" && (
                <DialogFooter className="w-full flex flex-col justify-center items-center space-y-3 lg:flex-row lg:justify-center lg:space-y-0 lg:space-x-3">
                    <Button 
                    onClick={closeAllModals}
                    className="w-full">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAction}
                        className="bg-violet hover:bg-violet-dark w-full"
                    >
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
    <Dialog open = {isModalOpen} onOpenChange={setIsModalOpen}  >
         {/* dropdown menu for file actions like edit, details*/}
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
                {/* map through the sharedFileActions array to set action state for each action value when it is clicked */}
                { sharedFileActions.map((actionItem)=>(
                   <DropdownMenuItem
                    key={actionItem.value}
                    className="w-full flex justify-center items-center"
                    onClick={()=>{
                        setAction(actionItem);
                        if(["details", "edit"].includes(actionItem.value)){
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
                    // if action is "edit", check for user permission 
                    ((actionItem.value === "edit" ? (
                        permissionType === "edit" ? (
                        //if user has permission to edit file, then render the "edit" item, else keep it hidden 
                        <div className="min-w-full flex justify-start items-center gap-5 hover:cursor-pointer">
                            <Image 
                           src={actionItem.icon}
                           alt={actionItem.label}
                           width={24}
                           height={24}
                          />
                            {actionItem.label}
                          </div>
                        ):(
                            <div className="hidden"></div>
                        )
                     ):
                    //  for other file actions, render the div element
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
                     )))                   
                    }
                   </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
         {/* call function renderDialogContent() after rendering the dropdown menu and if isUpload is false*/}
         {!isUpload && renderDialogContent()}

          {/* call function renderUploadDialog() after rendering the renderDialogContent if isUpload is true*/}
          {isUpload && renderUploadDialog()}
    </Dialog>
    );
};

export default SharedFileActions;