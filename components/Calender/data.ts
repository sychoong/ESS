import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  formatDate,
  parseDate,
  eachDay,
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
    { clockIn: string; clockOut: string; total: number }
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
  });

  // Create holiday map from holidaysData with date -> holiday_name
  const holidays: Record<string, string> = {};
  holidaysData.forEach(({ date, holiday_name }) => {
    holidays[date] = holiday_name;
  });
  const leaveByDate: Record<string, { leaveTypeName: string }> = {};
  leaveData.forEach((leave) => {
    const start = parseDate(leave.startDate);
    const end = parseDate(leave.endDate);
    for (const day of eachDay(start, end)) {
      leaveByDate[formatDate(day)] = {
        leaveTypeName: leave.leaveType,
      };
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
