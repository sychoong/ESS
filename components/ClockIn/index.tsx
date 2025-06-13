"use client";
import dynamic from "next/dynamic";
import ClockInButton from "./ClockInButton";
import { formatDate } from "@/util/helper";

function ClockIn({
  timeSheets,
  id,
}: {
  timeSheets: AttendanceDay[];
  id: string;
}) {
  const today = new Date();
  const todayTimeSheets = timeSheets.find(
    (item) => item.date === formatDate(today)
  );

  let clockInOrOut = false;
  let show = true;
  if (
    todayTimeSheets?.employee_attendances[0].clock_in &&
    todayTimeSheets?.employee_attendances[0].clock_out
  ) {
    show = false; //u done working
  } else if (todayTimeSheets?.employee_attendances[0].clock_in)
    clockInOrOut = false;// prepare to clock out
  else {
    //new day, time to work
    clockInOrOut = true;
  }

  //hide clock in on sunday and sat
  if (today.getDay() === 0 || today.getDay() === 6) show = false;

  return (
    <ClockInButton
      id={id}
      show={show} // Show button if no clock in or clock out
      clockInOrOut={clockInOrOut} // Clock in if no clock in, else clock out
    />
  );
}
export default dynamic(() => Promise.resolve(ClockIn), {
  ssr: false,
});
