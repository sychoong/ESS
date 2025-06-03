import { cookies } from "next/headers";
import { ESS_API_URL } from "../util/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getAttendance = async (
  startDate: string,
  endDate: string
): Promise<{
  timeSheets: AttendanceDay[];
  holidays: Holiday[];
}> => {
  const cookiesStore = await cookies();

  const url = "/v1/ess/attendance/employee/timesheets_v2";
  const token = cookiesStore.get("ess_token")?.value;
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const response = await fetch(
    `${ESS_API_URL}${url}?${new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
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
    throw new Error("Failed to fetch attendance data");
  }

  const { data } = await response.json();
  return {
    timeSheets: data.timesheets
      .filter(
        (item: { employee_attendances: Record<string, unknown>[] }) =>
          item.employee_attendances.length > 0
      )
      .map((item: { date: string; employee_attendances: any[] }) => ({
        date: item.date,
        employee_attendances: item.employee_attendances.map(
          (attendance: any): EmployeeAttendance => ({
            id: attendance.id,
            clock_in: attendance.clock_in,
            clock_out: attendance.clock_out,
            duration: attendance.duration,
          })
        ),
      })),
    holidays: data.holidays,
  };
};

export default getAttendance;
