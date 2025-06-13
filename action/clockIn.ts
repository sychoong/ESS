"use server";
import { cookies } from "next/headers";
import { ESS_API_URL, AUTH_COOKIE_NAME } from "@/util/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function clockIn(
  clockData: any
  //   token: string
): Promise<boolean> {
  const endPoint = "/v1/ess/attendance/attendance_log";
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const formData = new FormData();

  Object.entries(clockData).forEach(([key, value]) => {
    console.log("🚀 ~ Object.entries ~ clockData:", clockData)
    formData.append(key, String(value));
  });
    const response = await fetch(ESS_API_URL + endPoint, {
//   const response = await fetch("http://localhost:3000/api/test", { // For testing purposes, to check header
    method: "POST",
    headers: {
      Authorization: token,
      host: process.env.NEXT_PUBLIC_TALENT_CLOUD_URL || "",
      'x-forwarded-host': "",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to clock in");
  }
  return true;
}
