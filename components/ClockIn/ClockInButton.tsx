"use client";

import { BASE_LOCATION, ESS_API_URL } from "@/util/constants";
import { getLocation, testDistance } from "@/util/helper";
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

  const handleClick = async () => {
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
    console.log("🚀 ~ handleClick ~ clockData:", clockData)

    const endPoint = "/v1/ess/attendance/attendance_log";
    // const res = await fetch(ESS_API_URL + endPoint, {
    //   method: "POST",
    // });
  };
  return (
    <div className="flex flex-col mx-auto">
      <a
        href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
      >
        check location
      </a>
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
      <button
        onClick={() => {
          setLocation(getLocation());
        }}
      >
        Refresh Location
      </button>
      {show ? (
        <button onClick={handleClick}>
          {clockInOrOut ? "Clock In" : "Clock Out"}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClockInButton;
