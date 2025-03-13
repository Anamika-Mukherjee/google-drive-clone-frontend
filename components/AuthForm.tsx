"use client";

import axios from "axios";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

//define type for form type
type FormType = "sign-in" | "sign-up";

//define zod schema for sign up form 
const signUpSchema =  z.object({
    fullName: z.string()
              .min(2, "Full name must be atleast 2 characters!")
              .max(50, "Full name cannot be more than 50 characters!"),
    email: z.string().email(),
    password: z.string()
              .min(8, "Password must be atlease 8 characters!")
              .max(20, "Password cannot be more than 20 characters!"),
    confirmPassword: z.string()
                     .min(8,  "Password must be atlease 8 characters!")
                     .max(20, "Password cannot be more than 20 characters!")   
  }).superRefine((data, ctx)=>{
    if(data.password !== data.confirmPassword){
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match!",
        code: z.ZodIssueCode.custom
      });
    }
  });

//define zod schema for sign in form  
const signInSchema = z.object({
    email: z.string().email(),
    password: z.string()
              .min(8, "Password must be atlease 8 characters!")
              .max(20, "Password cannot be more than 20 characters!")    
  });


//define types for sign up and sign in schema
type signUpFormSchema = z.infer<typeof signUpSchema>
type signInFormSchema = z.infer<typeof signInSchema>

//define component for authentication form
const AuthForm = ({type}: {type: FormType}) =>{

  const [error, setError] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  
  
  //select form schema on the basis of form type
  const formSchema = type === "sign-in"? signInSchema: signUpSchema;

  //set default values for form control elements
  const form = useForm<signInFormSchema | signUpFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: type === "sign-up"? "": undefined,
      email: "",
      password: "",
      confirmPassword: type === "sign-up"? "": undefined
    }    
  });

  //display error message when error state changes
  useEffect(()=>{
    if(error){
      toast.error(error);
    }
  }, [error]);
    
  //function to sign in user
  const signIn = async (formData: FormData) =>{
    try{
        //initialize form data with email and password values 
        const formValues = {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        };

        //set loading state to true before api request
        setIsloading(true);

        //api request to backend to authenticate user
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/signin`, formValues, {
          headers: {
            "Content-Type": "application/json"
          },
        });

        //throw error if request is unsuccessful
        if (!response || response.status !== 200) { 
          const errorMsg = response?.data?.message || "Something went wrong!";
          throw new Error(errorMsg);
        }

        //if response contains access token, store the token in session storage and return the response data value
        if(response?.data && response?.data.accessToken){ 
          sessionStorage.setItem("accessToken", response?.data.accessToken);
          return response.data;
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
      //set loading state to false when request processed
      setIsloading(false);
    }
  };

  //function to sign up user
  const signUp= async (formData: FormData) =>{
    try{
      //initialize form data with full name, email and password values 
      const formValues = {
        fullName: formData.get("fullName") as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      //set loading state to true before api request
      setIsloading(true);

      //api request to backend to sign up user
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/signup`, formValues, {
        headers: {
          "Content-Type": "application/json"
        } 
      });

      //throw error if request is unsuccessful
      if (!response || response.status !== 200) { 
        const errorMsg = response?.data?.message || "Something went wrong!";
        throw new Error(errorMsg);
      }

      //if response contains access token, store the token in session storage and return the response data value
      if(response?.data && response?.data.accessToken){ 
        sessionStorage.setItem("accessToken", response?.data.accessToken);
        return response.data;
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
      //set loading state to false when request processed
      setIsloading(false);
    }
  };

  //submit handler for form submit event
  const onSubmit = async (values: signInFormSchema | signUpFormSchema) =>{
    //define formData object to store form data
    const formData = new FormData();

  
    if(type === "sign-up"){
      //if form type is sign-up, define types for sign-up form values and append them to formData object
      const {fullName, email, password} = values as signUpFormSchema;
    
      formData.append("fullName", fullName || "");
      formData.append("email", email);
      formData.append("password", password);
      
      //call function signup() with the formData object
      const res = await signUp(formData);

      //if response received, redirect to dashboard
      if(res){
        window.location.href = "/";
      }  
    }
    else{
      //if form type is sign-in, define types for sign-in form values and append them to formData object
      const {email, password} = values as signInFormSchema;
      formData.append("email", email);
      formData.append("password", password);

      //call function signin() with the formData object
      const res = await signIn(formData);
     
      //if response received, redirect to dashboard
      if(res){
        window.location.href = "/";
      }  
    }
  }

  //if page is loading, display message and loading spinner
  if(isLoading){
    return(
      <div>
        {type === "sign-in"? (
           <p>Signing in...</p>
        ):(
          <p>Signing up...</p>
        )} 
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
    <>
      <Form {...form}>
        <form onSubmit = {form.handleSubmit(onSubmit)} className = {type === "sign-up"? "sign-up-form": "sign-in-form"}>
          <h1
            className="w-full text-4xl text-center font-bold lg:text-2xl">
            {type === "sign-in"? "Sign In": "Sign Up"}
          </h1>
          <div 
          className={type  === "sign-up"? "sign-up-form-fields": "sign-in-form-fields"}>
          {type === "sign-up" && (
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full p-4 space-y-6 lg:w-2/5 lg:space-y-2 lg:p-0">
                <FormLabel
                  className="text-3xl lg:text-lg">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder = "Full Name" {...field} 
                    autoComplete="off"
                    className = "h-[50px] text-3xl lg:h-[35px] lg:text-lg"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full p-4 space-y-6 lg:w-2/5 lg:space-y-2 lg:p-0">
                <FormLabel
                  className="text-3xl lg:text-lg">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} 
                    autoComplete="off"
                    className = "h-[50px] text-3xl lg:h-[35px] lg:text-lg"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full p-4 space-y-6 lg:w-2/5 lg:space-y-2 lg:p-0">
                <FormLabel
                  className="text-3xl lg:text-lg">Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} 
                    className = "h-[50px] text-3xl lg:h-[35px] lg:text-lg"
                    type = "password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === "sign-up" && (
            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full p-4 space-y-6 lg:w-2/5 lg:space-y-2 lg:p-0">
                <FormLabel
                  className="text-3xl lg:text-lg">Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" {...field} 
                    className = "h-[50px] text-3xl lg:h-[35px] lg:text-lg"
                    type = "password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          )}
          
          <div className="w-full h-[60px] px-4 py-1 lg:w-2/5 lg:px-0 lg:h-[50px]">
          <Button 
          type = "submit"
          className = "w-full h-full bg-violet text-3xl hover:bg-violet-dark py-4 lg:w-full lg:text-xl">
            {type === "sign-in"? "Sign In": "Sign Up"}
          </Button>
          </div>
          <div className=" flex justify-center items-center">
            <p className="text-2xl mb-10 lg:text-base">{type === "sign-in"? "Don't have an account?": "Already have an account?"}
            </p>
                <Link 
                href={type === "sign-in"? "/sign-up": "/sign-in"}
                className="ml-2 mb-10 text-brand hover:text-brand-dark text-2xl lg:text-base">
                {type === "sign-in"? "Sign Up": "Sign In"}
                </Link>
          </div>
          </div>
        </form>
      </Form> 
    </>
  );
};
 
export default AuthForm;