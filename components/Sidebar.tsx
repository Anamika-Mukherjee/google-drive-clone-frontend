"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { usePathname } from "next/navigation";

interface Props{
  fullName: string,
  email: string
}

//component to render sidebar for navigation in large devices
const Sidebar = ({fullName, email}: Props) =>{

    const pathname = usePathname();
    
    return(
        <aside className = "sidebar">
           <Link href="/" className="w-full flex justify-start items-center p-4">
           <div className="lg:w-[50] h-full bg-brand p-2 rounded-2xl hidden lg:flex justify-center items-center">
             <Image 
             src="/logo.png"
             alt="logo"
             width = {30}
             height = {30}
             />
             </div>
           <div className="w-[40] h-full bg-brand p-2 rounded-lg lg:hidden flex justify-center items-center">
             <Image 
             src="/logo.png"
             alt="logo"
             width = {30}
             height = {30}
             />
             </div>
            <h1 className="hidden ml-2 text-xl text-brand lg:flex">Your Store</h1>
           </Link>

           <nav className="sidebar-nav">
            <ul className="w-full h-full flex flex-col space-y-6 md:items-center">
                {/* map each navItem to display the link for navbar items */}
                {navItems.map(({url, name, icon})=>(
                    <Link key={name} href = {url} className="w-full">
                        <li className ={pathname === url? "sidebar-nav-active":"sidebar-nav-item"}>                        
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
                        <p className="hidden lg:block">{name}</p> 
                        </li>
                   </Link>
                ))}
            </ul>
           </nav>

          <div className="sidebar-user-info">
          <Image 
           src={avatarPlaceholderUrl}
           alt="avatar"
           width={30}
           height={30}
           className="sidebar-user-avatar"
           />
           <div className="hidden lg:flex flex-col justify-center space-y-1 text-gray-dark text-xs/1 ml:10">
              <p className="subtitle capitalize">{fullName}</p>
              <p className="caption">{email}</p>
           </div>
          </div>
        </aside>
    );
};

export default Sidebar;
