import React from "react";
import Image from "next/image";
import { Toaster } from "sonner";

const Layout = ({children}: {children: React.ReactNode}) =>{
    return(
          <div className="flex h-auto lg:h-screen w-screen justify-between">
            <section className = "w-screen h-auto lg:h-screen flex flex-col justify-around items-center lg:justify-center lg:items-center lg:w-2/3 xl:w-2/3">
                <div className="w-full h-[100px] flex justify-center p-4 space-x-4 lg:hidden">
                  <div className="w-[70px] h-full bg-brand rounded-2xl flex justify-center items-center">
                  <Image 
                  src="/logo.png"
                  alt="logo"
                  width={40}
                  height={40}  
                  />
                  </div>
                  <h1 className="ml-1 text-4xl text-brand font-semibold flex justify-start items-center">Your Store</h1>
                </div>
               
                <div className="w-full min-h-4/5 max-h-auto flex flex-col justify-center items-center lg:h-full">
                  {children}
                </div>
                <Toaster position="top-left"/>
            </section>
            <section className="hidden xl:w-1/3 lg:w-1/3 min-h-screen lg:flex flex-col justify-around bg-brand p-8">
              <div className="w-full h-full text-white flex flex-col justify-start">
                <div className="w-full h-1/3 flex flex-col justify-start">
                  <div className="flex justify-start items-center">
                    <Image 
                    src="/logo.png" 
                    alt="logo" 
                    width={40} 
                    height={40}
                    />
                    <h1 className="ml-1 text-2xl">Your Store</h1>
                  </div>
                  <h1 className="mt-2 text-3xl">The Ultimate Storage Solution</h1>
                  <p className="mt-2 text-md">A place to store all your files.</p>
                </div>  
                <Image 
                  src="/assets/images/files.png" 
                  alt="illustration" 
                  width={350} 
                  height={350}
                  className="transition-all hover:-rotate-2 hover:scale-105 flex justify-self-center self-center"
                />
              </div>         
            </section>
          </div>    
    );
};

export default Layout;