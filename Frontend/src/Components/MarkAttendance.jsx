import React, { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from '../Components/components/ui/sheet';
import { Button } from '../Components/components/ui/button';
import {
  markAttendance,
  closeAttendanceSheet,
  resetAttendance,
  fetchAttendance,
} from '../feature/attendancefetch/attendanceSlice.js';
import { getSMTP } from '../feature/smtpfetch/smtpSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function MarkAttendance() {
  const [isImageRequired, setisImageRequired] = React.useState(true);
  const { attendance, error, isSheetOpen, isSubmitting } = useSelector(
    (state) => state.markAttendance
  );
  const dispatch = useDispatch();
  const { fetchedsmtp, updatedsmtp } = useSelector((state) => state.smtpSlice);

  useEffect(() => {
    dispatch(getSMTP());
  }, [updatedsmtp]);

  useEffect(() => {
    if (fetchedsmtp?.message) {
      const value = Object.values(fetchedsmtp?.message?.[0]?.Attendance);
      setisImageRequired(value);
    }
  }, [fetchedsmtp]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (attendance?.success === true) {
      toast.success('Attendance marked successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchAttendance());
      dispatch(resetAttendance());
    }
  }, [attendance?.success === true]);

  useEffect(() => {
    if (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    dispatch(resetAttendance());
  }, [error]);

  useEffect(() => {
    if (isSheetOpen && isImageRequired[0] === true) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          document.getElementById('AttendanceButton').disabled = true;
          toast.error('Error accessing camera', {
            position: 'top-right',
            autoClose: 3000,
          });
        });
    }
    if (!isSheetOpen) {
      stopCamera();
    }
  }, [isSheetOpen]);

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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/png');
    const response = await fetch(base64);
    const blob = await response.blob();
    let file;
    if (isImageRequired[0] === true) {
      file = new File([blob], 'attendance.png', {
        type: 'image/png',
      });
    } else {
      const response = await fetch('./download.png');
      const fallBackBlob = await response.blob();
      file = new File([fallBackBlob], 'attendance.png', { type: 'image/png' });
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const formData = new FormData();
          formData.append('attendance', file);
          formData.append('Latitude', latitude);
          formData.append('Longitude', longitude);

          dispatch(markAttendance({ attendance: file, latitude, longitude }));
          dispatch(closeAttendanceSheet());
          stopCamera();
        },
        (error) =>
          toast.error('Error in getting location', {
            position: 'top-right',
            autoClose: 3000,
          })
      );
    }
  };
  return (
    <div>
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) dispatch(closeAttendanceSheet());
        }}
      >
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
              id="AttendanceButton"
              onClick={captureImage}
              disabled={isSubmitting}
              className="px-6 py-2 mt-6 cursor-pointer bg-white text-black hover:bg-gray-50 border-black border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Mark Attendance'}
            </Button>
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MarkAttendance;
