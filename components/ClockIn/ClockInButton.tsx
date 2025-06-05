"use client";

import { BASE_LOCATION, ESS_API_URL } from "@/util/constants";
import { getLocation, testDistance } from "@/util/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ClockInButtonProps {
  show: boolean;
  clockInOrOut: boolean;
  id: string;
}

const ClockInButton: React.FC<ClockInButtonProps> = ({
  show,
  clockInOrOut,
  id,
}) => {
  const [location, setLocation] = useState(getLocation());
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const handleClick = async () => {
    try {
      const clockData = {
        type: clockInOrOut ? "1" : "2", // 1 for clock in, 2 for clock out
        device_type: "web",
        ip_address: "null",
        accuracy: 20,
        dateTime: new Date().toISOString().split(".")[0] + "+08:00",
        location: `${location.latitude}, ${location.longitude}`,
        external_id: id,
        remarks: "",
      };

      const endPoint = "/v1/ess/attendance/attendance_log";
      const formData = new FormData();
      Object.entries(clockData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const res = await fetch(ESS_API_URL + endPoint, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert(`Clock ${clockInOrOut ? "in" : "out"} successful!`);
        router.refresh(); // Refresh the page to update attendance status
      }
    } catch (error) {
      console.error("Error getting location:", error);
      alert(
        "Failed to clock " +
          (clockInOrOut ? "in" : "out") +
          ".Kindly check on talent cloud."
      );
      setError(true);
      return;
    }
  };
  if (!show) return <></>;

  return (
    <div className="flex flex-col mx-auto items-center gap-y-2">
      <p>
        Distance from base location:
        {testDistance(
          BASE_LOCATION[0],
          BASE_LOCATION[1],
          location.latitude,
          location.longitude
        )}
        meters
      </p>
      <a
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
      >
        Check location
      </a>
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => {
          setLocation(getLocation());
        }}
      >
        Refresh Location
      </button>
      {!error ? (
        <button
          onClick={handleClick}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {clockInOrOut ? "Clock In" : "Clock Out"}
        </button>
      ) : (
        <></>
      )}
      {error && (
        <a
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
          href={process.env.NEXT_PUBLIC_TALENT_CLOUD_URL}
        >
          Go to Vendor
        </a>
      )}
    </div>
  );
};

export default ClockInButton;
