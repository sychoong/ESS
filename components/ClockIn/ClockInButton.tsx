"use client";

import clockIn from "@/action/clockIn";
import { BASE_LOCATION } from "@/util/constants";
import { formatDateForClockIn, getLocation, testDistance } from "@/util/helper";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  /**
   * 生成半自然的打卡精度 (无小数点)
   * 85% 的概率生成 10 的倍数，15% 的概率生成 10~100 之间的任意整数
   */
  const generateSemiNaturalAccuracy = () => {
    const useMultipleOf10 = Math.random() < 0.85; // 85% 生成 10 的倍数
    if (useMultipleOf10) {
      const multiplesOf10 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      return multiplesOf10[Math.floor(Math.random() * multiplesOf10.length)];
    } else {
      // 生成 10~100 之间的任意整数，避免重复出现整十
      let value;
      do {
        value = Math.floor(Math.random() * 91) + 10;
      } while (value % 10 === 0);
      return value;
    }
  };

  const handleClick = async () => {
    setLoading(true);
    const now = new Date();
    const formattedDateString = formatDateForClockIn(now);

    try {
      const clockData = {
        type: clockInOrOut ? "1" : "2", // 1 for clock in, 2 for clock out
        device_type: "web",
        ip_address: "null",
        accuracy: generateSemiNaturalAccuracy(),
        datetime: formattedDateString,
        location: `${location.latitude}, ${location.longitude}`,
        external_id: id,
        remarks: "",
      };
      const res = await clockIn(clockData);

      if (res) {
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
    } finally {
      setLoading(false);
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
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-wait"
          disabled={loading}
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
