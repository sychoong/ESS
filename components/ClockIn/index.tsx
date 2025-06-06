"use client";
import dynamic from "next/dynamic";
import ClockInButton from "./ClockInButton";

function ClockIn({
  timeSheets,
  id,
}: {
  timeSheets: AttendanceDay[];
  id: string;
}) {
  const lastAttendance = timeSheets.length
    ? timeSheets[timeSheets.length - 1].employee_attendances[0]
    : null;
  const endOfDay =
    lastAttendance?.clock_in && lastAttendance?.clock_out ? true : false;

  const newDay =
    new Date().getDate() > new Date(lastAttendance?.clock_in || "").getDate();

  return (
    <ClockInButton
      id={id}
      show={!endOfDay || newDay} // Show button if no clock in or clock out
      clockInOrOut={lastAttendance?.clock_in ? false : true} // Clock in if no clock in, else clock out
    ></ClockInButton>
  );
}
export default dynamic(() => Promise.resolve(ClockIn), {
  ssr: false,
});
