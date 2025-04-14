import React,{useState,useRef, useEffect} from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "../Components/components/ui/sheet";
import { Button } from "../Components/components/ui/button";
import { markAttendance,resetAttendance } from "../feature/attendancefetch/attendanceSlice.js";    
import { useDispatch ,useSelector} from "react-redux";
import { toast } from "react-toastify";

 function AttendanceShortcut() {
    const [openAttendanceSheet, setOpenAttendanceSheet] = useState(false);
    const { attendance, error } = useSelector(
    (state) => state.markAttendance
  );
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(()=>{
         if (attendance?.success === true) {
        toast.success("Attendance marked successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        dispatch(resetAttendance());
 }},[attendance?.success]) 

 useEffect(()=>{
    if(error){
      toast.error(error.response.data.message,{
        position: "top-right",
        autoClose: 3000,
      })
    }
    dispatch(resetAttendance());
  },[error])

  useEffect(() => {
    if (openAttendanceSheet) {
      navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          }
        })
        .catch((error) =>  toast.error("Error accessing camera",{
          position: "top-right",
          autoClose: 3000,
        }));
      }
      if (!openAttendanceSheet) {
        stopCamera();
      }
    }, [openAttendanceSheet]);


    const stopCamera = () => {
      if (videoRef.current?.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    };

     const captureImage = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const base64 = canvas.toDataURL("image/png");
    const response = await fetch(base64);
    const blob = await response.blob();
    
    const file = new File([blob], "attendance.png", {
      type: "image/png",
    }); 

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const formData = new FormData();
          formData.append("attendance", file);
          formData.append("Latitude", latitude);
          formData.append("Longitude", longitude);
          
          dispatch(markAttendance({ attendance: file, latitude, longitude }));
          setOpenAttendanceSheet(false);
          stopCamera();
        },
        (error) => toast.error("Error in getting location",{
          position: "top-right",
          autoClose: 3000,
        })
      );
    } 
  };
  return (
    <div className="flex justify-end h-10 w-10 right-0 absolute bottom-110 z-50">
        <div className="flex h-auto w-auto justify-center items-center p-0">
     <button className="bg-transparent border-l  border-t border-b border-[rgb(120,173,196)] border-l-2  border-t-2 border-b-2 rounded cursor-pointer"
    onClick={() => setOpenAttendanceSheet(true)} >
        <svg className="text-[rgb(120,173,196)] w-7 h-7" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
        <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
        </svg>
     </button>
        </div>
      <Sheet open={openAttendanceSheet} onOpenChange={setOpenAttendanceSheet}>
        <SheetContent className="min-w-xl">
          <SheetHeader>
            <SheetTitle>Mark Attendance</SheetTitle>
          </SheetHeader>
          <div className="w-full flex justify-center mt-4">
            <video
              ref={videoRef}
              autoPlay
              className="w-full max-w-md rounded-lg border shadow-lg"
              ></video>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="flex justify-center mt-4">
            <Button
              onClick={captureImage}
              className="px-6 py-2 mt-6 bg-white text-black hover:bg-gray-50 border-black border disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Mark Attendance
            </Button>
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
                </div>
  );
}

export default AttendanceShortcut;

