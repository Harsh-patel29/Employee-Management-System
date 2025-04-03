import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../Components/components/ui/button";
import { Switch } from "../Components/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Components/components/ui/accordion";
import { getChangeDetail } from "../feature/datafetch/ChangeFetch";
import { getRoles } from "../feature/rolesfetch/getrolesSlice";

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
  const theme = useSelector((state) => state.theme.theme);
  const [Roles, setRoles] = useState([]);

  const { roles } = useSelector((state) => state.getrole);

  useEffect(() => {
    dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (roles?.message) {
      setRoles(roles.message);
    } else {
      setRoles([]);
    }
  }, [roles]);

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
    <>
      <div className=" absolute flex flex-col h-[80%]  bg-[#ffffff] rounded-xl  xl:w-[80%] xl:ml-30 mr-1.5 lg:w-[100%]  md:w-[90%]  sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300">
        <Button
          className="bg-[#338DB5] hover:bg-[#338eb5d6] w-20 ml-3"
          onClick={() => {
            navigate("/users");
          }}
        >
          Go Back
        </Button>
        <div
          className="flex flex-col h-screen overflow-y-auto  bg-[#ffffff] rounded-xl xl:w-[90%]  mr-1.5 lg:w-[100%]  md:w-[90%]  sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300
        "
        >
          <div className="flex w-full justify-between">
            <h1 className="text-2xl font-semibold">Manage Access</h1>
            <button
              className="text-2xl font-semibold"
              onClick={() => navigate("/create/roles/")}
            >
              New Role
            </button>
          </div>
          <Accordion type="single" collapsible className="w-[100%]">
            {Roles.map((role) => (
              <AccordionItem key={role._id} value={role._id}>
                <AccordionTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAccordion(role._id);
                  }}
                  className={`${
                    theme === "light"
                      ? "bg-[#cce7f2]"
                      : "bg-[#161b22] border-[#374151]"
                  } h-20 mt-4 text-2xl`}
                >
                  <div
                    variant="outline"
                    className="w-full flex justify-start h-full items-center ml-8 -mt-0.5"
                  >
                    <svg
                      class="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#338DB5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.356 3.066a1 1 0 0 0-.712 0l-7 2.666A1 1 0 0 0 4 6.68a17.695 17.695 0 0 0 2.022 7.98 17.405 17.405 0 0 0 5.403 6.158 1 1 0 0 0 1.15 0 17.406 17.406 0 0 0 5.402-6.157A17.694 17.694 0 0 0 20 6.68a1 1 0 0 0-.644-.949l-7-2.666Z" />
                    </svg>

                    <span className="font-semibold">{role.name}</span>
                  </div>
                </AccordionTrigger>
                {activeAccordion === role._id && (
                  <AccordionContent className="mt-2 rounded-sm  bg-[#d1f0fd]">
                    <div className="flex text-2xl font-semibold justify-center ">
                      {Object.keys(role.access)}
                    </div>
                    {Object.keys(permissions).length > 0 ? (
                      Object.entries(permissions).map(([key, value]) => (
                        <AccordionContent
                          key={key}
                          className="flex w-full justify-between h-full items-start"
                        >
                          <strong className="text-sm">
                            {key.replace(/_/g, " ")}
                          </strong>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleToggle(key, checked)
                            }
                            className="data-[state=checked]:bg-blue-500 "
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
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Roles;
