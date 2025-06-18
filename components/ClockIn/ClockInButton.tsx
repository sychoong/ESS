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
   * 生成半自然的打卡精度
   * 50% 的概率生成 10 的倍数 (20,30)，50% 的概率生成 10~40 之间的任意整数
   */

  const generateAccurateFloat = () => {
    const float = Math.random() * 40 + 10;
    const fixedStr = float.toFixed(15); // 字符串，确保 15 位
    const parsed = parseFloat(fixedStr); // 可能会丢失尾部 0

    const parsedStr = parsed.toString();
    const decimal = parsedStr.split(".")[1] || "";

    // 检查当前小数位数
    if (decimal.length < 15) {
      const missingCount = 15 - decimal.length;

      // 随机生成非零数字序列来补尾
      const nonZeroDigits = Array.from(
        { length: missingCount },
        () => Math.floor(Math.random() * 9) + 1 // 1~9，不含0
      ).join("");

      const paddedStr = parsedStr.includes(".")
        ? parsedStr + nonZeroDigits
        : parsedStr + "." + nonZeroDigits;

      return parseFloat(paddedStr);
    }

    return parsed;
  };

  const generateSemiNaturalAccuracy = () => {
    const useInteger = Math.random() < 0.5; // 50% 几率为整数，50% 为 15 位小数
    if (useInteger) {
      const multiplesOf10 = [20, 30];
      return multiplesOf10[Math.floor(Math.random() * multiplesOf10.length)];
    } else {
      return generateAccurateFloat();
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
