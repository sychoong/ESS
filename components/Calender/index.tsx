import Calendar from "./Calender";
import getData from "./data";

export default function CalendarWrapper({
  timeSheets,
  selectedMonth,
  holidays,
  leave,
}: {
  timeSheets: AttendanceDay[];
  selectedMonth: number;
  holidays: Holiday[];
  leave: Leave[];
}) {
  const { calendarDates, attendanceByDate, holidaysData, leaveData } = getData(
    timeSheets,
    selectedMonth,
    holidays,
    leave
  );
  return (
    <Calendar
      month={selectedMonth}
      calendarDates={calendarDates}
      attendanceByDate={attendanceByDate}
      holidays={holidaysData}
      leave={leaveData}
    />
  );
}
