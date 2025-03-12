import React from "react";
import {useParams, usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb" 

const Breadcrumbs = ()=>{

    //get the "type" params for the route 
    const {type} = useParams();
    const pageType: string = type as string;
    const path = usePathname();

    return(
        <Breadcrumb className="w-2/5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {/* don't render separator for home page */}
                {path !== "/" && (
                    <BreadcrumbSeparator />
                )}
                
                <BreadcrumbItem>
                    {/* if params is one of the four page types, display the name of page type */}
                    {["documents", "images", "media", "others"].includes(pageType) && (
                        <BreadcrumbLink href={pageType} className="capitalize">{pageType}</BreadcrumbLink>
                    )}
                    {/* if path contains "shared", display "Shared" */}
                    {path.includes("/shared") && (
                        <BreadcrumbLink href="/shared" className="capitalize">Shared</BreadcrumbLink>
                    )}
                    {/* if path contains "trash", display "Trash" */}
                    {path.includes("/trash") && (
                        <BreadcrumbLink href="/trash" className="capitalize">Trash</BreadcrumbLink>

                    )}
                    
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
export default Breadcrumbs;