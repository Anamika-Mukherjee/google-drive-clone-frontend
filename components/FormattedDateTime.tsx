import React from "react";
import { formatDateTime } from "@/lib/utils";

//component to format date and time from ISO string to time and date format with time zone adjustment
const FormattedDateTime = ({date, className}:{date: string, className?: string})=>{

    return(
        
        <p className="text-gray-500">
            
            {formatDateTime(date)}
        </p>
    );
}

export default FormattedDateTime;