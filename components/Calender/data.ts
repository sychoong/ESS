import { MINUTES_8_HOURS, LUNCH_BREAK_MINUTES, REPLACEMENT_HOURS } from "@/util/constants";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  formatDate,
  parseDate,
  eachDay,
  formatTime,
  formatTimeIn12Hour,
} from "@/util/helper";

const getData = (
  timeSheets: AttendanceDay[],
  selectedMonth: number,
  holidaysData: Holiday[],
  leaveData: Leave[]
) => {
  const year = new Date().getFullYear();
  const startDate = new Date(year, selectedMonth - 1, 1);
  const startMonth = startOfMonth(startDate);
  const endMonth = endOfMonth(startDate);
  const today = new Date();
  // Calendar grid start & end dates (Sunday - Saturday)
  const calendarStart = startOfWeek(startMonth);
  const calendarEnd = endOfWeek(endMonth);

  const calendarDates: string[] = [];
  for (let d = new Date(calendarStart); d <= calendarEnd; d = addDays(d, 1)) {
    calendarDates.push(formatDate(d));
  }
  // Map date string -> total duration worked in mins
  const attendanceByDate: Record<
    string,
    {
      clockIn: string;
      clockOut: string;
      total: number;
    }
  > = {};
  timeSheets.forEach(({ date, employee_attendances }) => {
    let total = 0;
    employee_attendances.forEach((ea) => {
      if (ea.duration) total += ea.duration;
    });
    attendanceByDate[date] = {
      clockIn: employee_attendances[0]?.clock_in || "",
      clockOut: employee_attendances[0]?.clock_out || "",
      total: total,
    };
    if (
      employee_attendances[0]?.clock_in &&
      employee_attendances[0]?.clock_out
    ) {
      attendanceByDate[date].total -= LUNCH_BREAK_MINUTES; // Subtract 1.5 hours for lunch break
    }
  });


  // Create holiday map from holidaysData with date -> holiday_name
  const holidays: Record<string, string> = {};
  holidaysData.forEach(({ date, holiday_name }) => {
    holidays[date] = holiday_name;
  });
  const leaveByDate: Record<
    string,
    { leaveTypeName: string; hourApplied: number }
  > = {};
  leaveData.forEach((leave) => {
    const start = parseDate(leave.startDate);
    const end = parseDate(leave.endDate);
    for (const day of eachDay(start, end)) {
      leaveByDate[formatDate(day)] = {
        leaveTypeName: leave.leaveType,
        hourApplied: 0,
      };
      if (leaveByDate[formatDate(day)].leaveTypeName === REPLACEMENT_HOURS) {
        leaveByDate[formatDate(day)].hourApplied = leave.hourApplied;
      }
    }
  });
  return {
    calendarDates,
    attendanceByDate,
    holidaysData: holidays,
    leaveData: leaveByDate,
  };
};

export default getData;
