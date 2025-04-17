// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router";
// import axios from "axios";
// import { Button } from "../Components/components/ui/button";
// import { Switch } from "../Components/components/ui/switch";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../Components/components/ui/dropdown";
// import { getChangeDetail } from "../feature/datafetch/ChangeFetch.js";

// const updateAccess = (userId, key, value) => {
//   return axios.put(
//     `http://localhost:8000/api/v1/user/settings/fetch/${userId}`,
//     { key, value },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// const Settings = () => {
//   const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
//   const theme = useSelector((state) => state.theme.theme);

//   const dispatch = useDispatch();

//   const { id } = useParams();

//   const [userid, setuserid] = useState(id);

//   const navigate = useNavigate();

//   useEffect(() => {
//     setuserid(id);
//   }, [id]);

//   const detail = useSelector((state) => state.ChangeAccess);
//   const getPermissionById = async (id) => {
//     dispatch(getChangeDetail(id));
//   };

//   const [permissions, setPermissions] = useState({});
//   useEffect(() => {
//     if (detail?.detail?.message) {
//       setPermissions({ ...detail.detail.message });
//     }
//   }, [detail]);

//   const handleToggle = (key, checked) => {
//     setPermissions((prev) => ({
//       ...prev,
//       [key]: checked,
//     }));
//     updateAccess(userid, key, checked)
//       .then((response) => {})
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div
//       className={`absolute flex flex-col justify-evenly rounded-md lg:ml-30 md:ml-25 sm:ml-30 mt-20 shadow-xl min-w-0 xl:w-[80%] xl:h-[70%]
//          lg:h-[80%] lg:w-[85%] md:h-[85%] md:w-[80%] sm:h-[80%] sm:w-[80%] transition-all duration-300 ${
//            isExpanded
//              ? "xl:scale-x-90 xl:left-15 xl:right-10 lg:scale-x-90 md:scale-x-80 sm:scale-x-80 "
//              : "xl:scale-x-100 xl:left-10 lg:scale-x-100 lg:left-7 md:scale-x-100 sm:scale-x-100"
//          }
//       ${theme === "light" ? "bg-white" : "bg-[#0b0d12]"}
//         `}
//     >
//       <DropdownMenu
//         onOpenChange={(open) => {
//           if (!open) {
//             navigate(`/settings`);
//           } else {
//             navigate(`/settings/67ac6426aef8063f23746a75`);
//             getPermissionById("67ac6426aef8063f23746a75");
//           }
//         }}
//       >
//         <DropdownMenuTrigger
//           asChild
//           className={`${
//             theme === "light" ? "bg-[#bfdbfe]" : "bg-[#161b22] border-[#374151]"
//           } h-20 text-xl`}
//         >
//           <Button
//             variant="outline"
//             className={`w-full ${
//               theme === "light" ? "" : "hover:bg-[#374151]"
//             }`}
//           >
//             Admin
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className={`w-4xl ${
//             theme === "light" ? "" : "bg-[#23272F] text-[#eaf4fd]"
//           }`}
//         >
//           <DropdownMenuLabel className="flex justify-center ">
//             Access
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {Object.keys(permissions).length > 0 ? (
//               Object.entries(permissions).map(([key, value]) => (
//                 <DropdownMenuItem
//                   key={key}
//                   className="flex justify-between items-center"
//                 >
//                   <strong className="text-sm">{key.replace(/_/g, " ")}</strong>
//                   <Switch
//                     onClick={(e) => e.stopPropagation()} // prevents dropdown from closing when clicked
//                     checked={value}
//                     onCheckedChange={(checked) => handleToggle(key, checked)}
//                     className="data-[state=checked]:bg-blue-500"
//                   />
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <p className="text-center bg-[#374151] text-gray-500">
//                 No permissions found
//               </p>
//             )}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <DropdownMenu
//         onOpenChange={(open) => {
//           if (!open) {
//             navigate(`/settings`);
//           } else {
//             navigate(`/settings/67ac67accbab2e409938d0ce`);
//             getPermissionById("67ac67accbab2e409938d0ce");
//           }
//         }}
//       >
//         <DropdownMenuTrigger
//           asChild
//           className={`${
//             theme === "light" ? "bg-[#bfdbfe]" : "bg-[#161b22] border-[#374151]"
//           } h-20 text-xl`}
//         >
//           <Button
//             variant="outline"
//             className={`w-full ${
//               theme === "light" ? "" : "hover:bg-[#374151]"
//             }`}
//           >
//             Developer
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className={`w-4xl ${
//             theme === "light" ? "" : "bg-[#23272F] text-[#eaf4fd] "
//           }`}
//         >
//           <DropdownMenuLabel className="flex justify-center">
//             Access
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {Object.keys(permissions).length > 0 ? (
//               Object.entries(permissions).map(([key, value]) => (
//                 <DropdownMenuItem
//                   key={key}
//                   className="flex justify-between items-center"
//                 >
//                   <strong className="text-sm">{key.replace(/_/g, " ")}</strong>
//                   <Switch
//                     onClick={(e) => e.stopPropagation()} // prevents dropdown from closing when clicked
//                     checked={value}
//                     onCheckedChange={(checked) => handleToggle(key, checked)}
//                     className="data-[state=checked]:bg-blue-500"
//                   />
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No permissions found</p>
//             )}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <DropdownMenu
//         onOpenChange={(open) => {
//           if (!open) {
//             navigate(`/settings`);
//           } else {
//             navigate(`/settings/67ac67db190f041e27634fb3`);
//             getPermissionById("67ac67db190f041e27634fb3");
//           }
//         }}
//       >
//         <DropdownMenuTrigger
//           asChild
//           className={`${
//             theme === "light" ? "bg-[#bfdbfe]" : "bg-[#161b22] border-[#374151]"
//           } h-20 text-xl`}
//         >
//           <Button
//             variant="outline"
//             className={`w-full ${
//               theme === "light" ? "" : "hover:bg-[#374151]"
//             }`}
//           >
//             HR
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className={`w-4xl ${
//             theme === "light" ? "" : "bg-[#23272F] text-[#eaf4fd]"
//           }`}
//         >
//           <DropdownMenuLabel className="flex justify-center">
//             Access
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {Object.keys(permissions).length > 0 ? (
//               Object.entries(permissions).map(([key, value]) => (
//                 <DropdownMenuItem
//                   key={key}
//                   className="flex justify-between items-center"
//                 >
//                   <strong className="text-sm">{key.replace(/_/g, " ")}</strong>
//                   <Switch
//                     onClick={(e) => e.stopPropagation()} // prevents dropdown from closing when clicked
//                     checked={value}
//                     onCheckedChange={(checked) => handleToggle(key, checked)}
//                     className="data-[state=checked]:bg-blue-500"
//                   />
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No permissions found</p>
//             )}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <DropdownMenu
//         onOpenChange={(open) => {
//           if (!open) {
//             navigate(`/settings`);
//           } else {
//             navigate(`/settings/67ac67fe40c38b9cb8e3186e`);
//             getPermissionById("67ac67fe40c38b9cb8e3186e");
//           }
//         }}
//       >
//         <DropdownMenuTrigger
//           asChild
//           className={`${
//             theme === "light"
//               ? "bg-[#bfdbfe] border"
//               : "bg-[#161b22] border-[#374151]"
//           } h-20 text-xl`}
//         >
//           <Button
//             variant="outline"
//             className={`w-full ${
//               theme === "light" ? "" : "hover:bg-[#374151]"
//             }`}
//           >
//             Product_Manager
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className={`w-4xl ${
//             theme === "light" ? "" : "bg-[#23272F] text-[#eaf4fd]"
//           }`}
//         >
//           <DropdownMenuLabel className="flex justify-center">
//             Access
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {Object.keys(permissions).length > 0 ? (
//               Object.entries(permissions).map(([key, value]) => (
//                 <DropdownMenuItem
//                   key={key}
//                   className="flex justify-between items-center hover:bg-[#374151]"
//                 >
//                   <strong className="text-sm">{key.replace(/_/g, " ")}</strong>
//                   <Switch
//                     onClick={(e) => e.stopPropagation()}
//                     checked={value}
//                     onCheckedChange={(checked) => handleToggle(key, checked)}
//                     className="data-[state=checked]:bg-blue-500 "
//                   />
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No permissions found</p>
//             )}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

// export default Settings;

import React from 'react';

const Settings = () => {
  return <div>Settings</div>;
};

export default Settings;
