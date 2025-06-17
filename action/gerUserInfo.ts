import { cookies } from "next/headers";
import { ESS_API_URL, AUTH_COOKIE_NAME } from "@/util/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getUserInfo = async (): Promise<{ id: string; name: string }> => {
  const url = "/employee_info";
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const response = await fetch(`${ESS_API_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      host: process.env.NEXT_PUBLIC_TALENT_CLOUD_URL || "",
      "x-forwarded-host": "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leave data");
  }

  const { data } = await response.json();
  return { id: data.employee_info.id, name: data.employee_info.firstname };
};

export default getUserInfo;
