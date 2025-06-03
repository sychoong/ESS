import { cookies } from "next/headers";
import { ESS_API_URL } from "../util/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getAttendance = async (
  startDate: string,
  endDate: string
): Promise<Leave[]> => {
  const url = "/v1/ess/leave/leave_application/employee";
  const cookiesStore = await cookies();
  const token = cookiesStore.get("ess_token")?.value;
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const response = await fetch(
    `${ESS_API_URL}${url}?${new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      limit: "50",
    }).toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leave data");
  }

  const { data } = await response.json();
  return data.data.map((item: any) => ({
    startDate: item.start_date,
    endDate: item.end_date,
    leaveType: item.leave_type.name,
  }));
};

export default getAttendance;
