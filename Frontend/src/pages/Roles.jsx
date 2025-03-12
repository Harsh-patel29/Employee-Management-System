import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../Components/components/ui/button.js";
import { Switch } from "../Components/components/ui/switch.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Components/components/ui/dropdown.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Components/components/ui/accordion";

import { getChangeDetail } from "../feature/datafetch/ChangeFetch.js";
import { AccordionHeader } from "@radix-ui/react-accordion";

const updateAccess = (userId, key, value) => {
  return axios.put(
    `http://localhost:8000/api/v1/user/settings/fetch/${userId}`,
    { key, value },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const Roles = () => {
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  const theme = useSelector((state) => state.theme.theme);

  const dispatch = useDispatch();

  const { id } = useParams();

  const [userid, setuserid] = useState(id);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setuserid(id);
  }, [id]);

  const detail = useSelector((state) => state.ChangeAccess);
  const getPermissionById = async (id) => {
    dispatch(getChangeDetail(id));
  };

  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    if (detail?.detail?.message) {
      setPermissions({ ...detail.detail.message });
    }
  }, [detail]);

  const handleToggle = (key, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }));
    updateAccess(userid, key, checked)
      .then((response) => {})
      .catch((err) => console.error(err));
  };

  const toggleAccordion = (roleId) => {
    if (activeAccordion === roleId) {
      setActiveAccordion(null);
      navigate("/users/roles/");
    } else {
      setActiveAccordion(roleId);
      navigate(`/users/roles/${roleId}`);
      getPermissionById(roleId);
    }
  };

  return (
    <div
      className={`absolute flex flex-col justify-evenly rounded-md lg:ml-30 md:ml-25 sm:ml-30 mt-20 shadow-xl  min-w-0 xl:w-[80%] xl:h-[75%]
         lg:h-[80%] lg:w-[85%] md:h-[85%] md:w-[80%] sm:h-[80%] sm:w-[80%] transition-all duration-300 ${
           isExpanded
             ? "xl:scale-x-90 xl:left-15 xl:right-10 lg:scale-x-90 md:scale-x-80 sm:scale-x-80 "
             : "xl:scale-x-100 xl:left-10 lg:scale-x-100 lg:left-7 md:scale-x-100 sm:scale-x-100 "
         } 
      ${theme === "light" ? "bg-white" : "bg-[#0b0d12]"}
        `}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("67ac6426aef8063f23746a75");
            }}
            className={`${
              theme === "light"
                ? "bg-[#bfdbfe]"
                : "bg-[#161b22] border-[#374151]"
            } h-20 text-xl`}
          >
            <div
              variant="outline"
              className="w-full flex justify-center items-center ml-8 "
            >
              Admin
            </div>
          </AccordionTrigger>
          {activeAccordion === "67ac6426aef8063f23746a75" && (
            <AccordionContent className="max-h-[200px] overflow-y-auto">
              <div className="flex text-2xl font-semibold justify-center">
                Users
              </div>
              {Object.keys(permissions).length > 0 ? (
                Object.entries(permissions).map(([key, value]) => (
                  <AccordionContent
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <strong className="text-sm">
                      {key.replace(/_/g, " ")}
                    </strong>
                    <Switch
                      onClick={(e) => e.stopPropagation()}
                      checked={value}
                      onCheckedChange={(checked) => handleToggle(key, checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </AccordionContent>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No permissions found
                </p>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("67ac67accbab2e409938d0ce");
            }}
            className={`${
              theme === "light"
                ? "bg-[#bfdbfe]"
                : "bg-[#161b22] border-[#374151]"
            } h-20 text-xl`}
          >
            <div
              variant="outline"
              className="w-full flex justify-center items-center ml-8 "
            >
              Developer
            </div>
          </AccordionTrigger>
          {activeAccordion === "67ac67accbab2e409938d0ce" && (
            <AccordionContent className="max-h-[200px] overflow-y-auto">
              <div className="flex text-2xl font-semibold justify-center">
                Users
              </div>
              {Object.keys(permissions).length > 0 ? (
                Object.entries(permissions).map(([key, value]) => (
                  <AccordionContent
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <strong className="text-sm">
                      {key.replace(/_/g, " ")}
                    </strong>
                    <Switch
                      onClick={(e) => e.stopPropagation()}
                      checked={value}
                      onCheckedChange={(checked) => handleToggle(key, checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </AccordionContent>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No permissions found
                </p>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("67ac67db190f041e27634fb3");
            }}
            className={`${
              theme === "light"
                ? "bg-[#bfdbfe]"
                : "bg-[#161b22] border-[#374151]"
            } h-20 text-xl`}
          >
            <div
              variant="outline"
              className="w-full flex justify-center items-center ml-8 "
            >
              HR
            </div>
          </AccordionTrigger>
          {activeAccordion === "67ac67db190f041e27634fb3" && (
            <AccordionContent className="max-h-[200px] overflow-y-auto">
              <div className="flex text-2xl font-semibold justify-center">
                Users
              </div>
              {Object.keys(permissions).length > 0 ? (
                Object.entries(permissions).map(([key, value]) => (
                  <AccordionContent
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <strong className="text-sm">
                      {key.replace(/_/g, " ")}
                    </strong>
                    <Switch
                      onClick={(e) => e.stopPropagation()}
                      checked={value}
                      onCheckedChange={(checked) => handleToggle(key, checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </AccordionContent>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No permissions found
                </p>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("67ac67fe40c38b9cb8e3186e");
            }}
            className={`${
              theme === "light"
                ? "bg-[#bfdbfe]"
                : "bg-[#161b22] border-[#374151]"
            } h-20 text-xl`}
          >
            <div
              variant="outline"
              className="w-full flex justify-center items-center ml-8 "
            >
              Product_Manager
            </div>
          </AccordionTrigger>
          {activeAccordion === "67ac67fe40c38b9cb8e3186e" && (
            <AccordionContent className="max-h-[200px] overflow-y-auto">
              <div className="flex text-2xl font-semibold justify-center">
                Users
              </div>
              {Object.keys(permissions).length > 0 ? (
                Object.entries(permissions).map(([key, value]) => (
                  <AccordionContent
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <strong className="text-sm">
                      {key.replace(/_/g, " ")}
                    </strong>
                    <Switch
                      onClick={(e) => e.stopPropagation()}
                      checked={value}
                      onCheckedChange={(checked) => handleToggle(key, checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </AccordionContent>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No permissions found
                </p>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Roles;
