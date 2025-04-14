import React from "react";
import * as XLSX from "xlsx";

const ExporttoExcel = ({data,fileName})=>{
    const handleExport = ()=>{
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook,worksheet,"Sheet1");
        XLSX.writeFile(workbook,`${fileName}.xlsx`);
    }
    return( 
        <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[110px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
        <button onClick={handleExport}>

<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <title>Export Project</title>
<polyline points="8 17 12 21 16 17"></polyline>
<line x1="12" y1="12" x2="12" y2="21"></line>
<path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
</svg>  
        </button>
                Export 
              </div>
    )
}


export default ExporttoExcel;
