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
import { getRoles, deleteRole,resetDeletedRole } from "../feature/rolesfetch/getrolesSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";    
import { Bounce, toast } from "react-toastify";

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
const [dialogOpen, setdialogOpen] = useState(false);
  const { roles ,deletedRole} = useSelector((state) => state.getrole);

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

  const openDialog = (id) => {
    navigate(`/users/roles/delete/${id}`);
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  useEffect(() => {
    if (deletedRole?.success === true) {
      setdialogOpen(false);
      dispatch(getRoles());
      navigate("/users/roles");
    }
    return () => {
      dispatch(resetDeletedRole());
    }
  }, [deletedRole]);

  if(deletedRole?.success){
    toast.success("Role deleted successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }

  return (
    <>
      <div className="absolute flex flex-col h-[80%]  bg-[#ffffff] rounded-xl  xl:w-[80%] xl:ml-30 mr-1.5 lg:w-[100%]  md:w-[90%]  sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[100px] justify-center text-[17px] h-9 flex items-center hover:bg-[#dbf4ff] transition-all duration-300"
            onClick={() => {
              navigate("/users");
            }}
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"></path>
            </svg>
            Go back
          </Button>
          <h1 className="text-2xl font-semibold">Manage Access</h1>
          <button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[125px] justify-center text-[17px] h-9 flex items-center hover:bg-[#dbf4ff] transition-all duration-300" 
            onClick={() => navigate("/create/roles/")}
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#338DB5" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"></path>
            </svg>
            New Role
          </button>
        </div>
        <div className="flex flex-col h-screen overflow-y-auto bg-[#ffffff] rounded-xl xl:w-[100%]  pl-14 pr-14 lg:w-[100%] md:w-[90%] sm:w-[88%] max-sm:w-[86%] transition-all duration-300">
          <Accordion type="single" collapsible className="w-[100%]">
            {Roles.map((role) => (
              <AccordionItem key={role._id} value={role._id}>
                <AccordionTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAccordion(role._id);
                  }}
                  className="bg-[#cce7f2] border-[#374151]h-20 mt-4 text-2xl"
                >
                  <div
                    variant="outline"
                    className="w-full flex justify-start h-full items-center ml-8 -mt-0.5"
                  >
                    <svg
                      class="w-8 h-8"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#338DB5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.356 3.066a1 1 0 0 0-.712 0l-7 2.666A1 1 0 0 0 4 6.68a17.695 17.695 0 0 0 2.022 7.98 17.405 17.405 0 0 0 5.403 6.158 1 1 0 0 0 1.15 0 17.406 17.406 0 0 0 5.402-6.157A17.694 17.694 0 0 0 20 6.68a1 1 0 0 0-.644-.949l-7-2.666Z" />
                    </svg>

                    <span className="font-semibold">{role.name}
                    </span>
                    <div className="flex justify-end w-full items-center gap-5 text-2xl">
                      <FaEdit className=" font-semibold text-[#338DB5]" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/update/roles/${role._id}`);
                      }}/>
                    <Dialog
            onOpenChange={(open) => {
              if (!open) navigate("/users/roles");
            }}
          >
            <DialogTrigger
              onClick={() => {
                openDialog(role._id);
              }}
              asChild
            >
              <MdDelete
                className="font-semibold text-[#FD6E6E]" onClick={(e) => {
                  e.stopPropagation();
                }} 
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                This action cannot be undone. This will permanently delete the role.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteRole(role._id));
                    }}
                  >
                    Delete
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
                    </div>
                  </div>
                </AccordionTrigger>
                {activeAccordion === role._id && (
                  <AccordionContent className="relative mt-2 w-[100%]  rounded-sm  bg-[#edf7fb] mb-2">
                    <div className="flex text-2xl font-semibold justify-center capitalize">
                      {Object.keys(role.access)}
                    </div>
                    {Object.keys(permissions).length > 0 ? (
                      Object.entries(permissions).map(([key, value,index]) => (
                        <AccordionContent
                          key={key}
                          index={index}
                          className="flex w-full justify-between p-2 pl-32 pr-32 h-full items-start capitalize font-medium"
                        >
                          <h6 className="text-md">
                            {Object.keys(permissions).indexOf(key) + 1} . {key.replace(/_/g, " ")}
                          </h6>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleToggle(key, checked)
                            }
                            className="data-[state=checked]:bg-[#78adc4]"
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
