import { MINUTES_8_HOURS, LUNCH_BREAK_MINUTES } from "@/util/constants";
import { parseDate } from "@/util/helper";

const getData = (
  timeSheets: AttendanceDay[],
  selectedMonth: number,
  replacementLeaveHours: number,
  currentMonth: number
) => {
  const year = new Date().getFullYear();
  const month = selectedMonth || new Date().getMonth() + 1; // 1-based month
  // Sum total duration and count work days in this period
  let totalMinutesInPeriod = replacementLeaveHours * 60; // Convert hours to minutes
  let workDaysInPeriod = 0;

  const periodStart = new Date(year, month - 2, 21); // previous month 21st
  const periodEnd = new Date(year, month - 1, 20); // current month 20th
  periodStart.setHours(0, 0, 0, 0);
  periodEnd.setHours(23, 59, 59, 999);

  timeSheets.forEach(({ date, employee_attendances }) => {
    const d = parseDate(date);
    if (d >= periodStart && d <= periodEnd) {
      let dayDuration = -LUNCH_BREAK_MINUTES; // Start with lunch break subtracted
      employee_attendances.forEach((ea) => {
        if (ea.duration) dayDuration += ea.duration;
      });
      if (dayDuration > 0) {
        totalMinutesInPeriod += dayDuration;
        workDaysInPeriod++;
      }
    }
  });

  // Calculate average (minutes per workday)
  const avgMinutesPerDay =
    workDaysInPeriod > 0 ? totalMinutesInPeriod / workDaysInPeriod : 0;
  const meetsThreshold = avgMinutesPerDay >= MINUTES_8_HOURS; // 8 hours in minutes

  const shouldWorkHours = workDaysInPeriod * MINUTES_8_HOURS; // Total expected work hours in minutes
  const workHoursLeft = shouldWorkHours - totalMinutesInPeriod; // Remaining work hours in minutes
  const minThreshold = MINUTES_8_HOURS - workHoursLeft; 
  const lastAttendance = timeSheets.length?
        timeSheets[timeSheets.length - 1].employee_attendances[0]
    : null;

  let expectedClockOut =
    lastAttendance?.clock_in
      ? new Date(
          new Date(lastAttendance.clock_in).getTime() +
          MINUTES_8_HOURS * 60 * 1000 + // 8 hours in milliseconds
          LUNCH_BREAK_MINUTES * 60 * 1000 + // Lunch break in milliseconds
          minThreshold * 60 * 1000
      )
    : null;
  if (currentMonth !== selectedMonth) expectedClockOut = null;
  if (lastAttendance?.clock_in && lastAttendance?.clock_out) expectedClockOut = null;
  
  return {
    totalMinutesInPeriod,
    workDaysInPeriod,
    avgMinutesPerDay,
    meetsThreshold,
    periodStart,
    periodEnd,
    expectedClockOut,
    workHoursLeft
  };
};

export default getData;
