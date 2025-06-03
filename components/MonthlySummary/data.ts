import { DAY_9_30_HOURS } from "@/util/constants";
import { parseDate } from "@/util/helper";

const getData = (timeSheets: AttendanceDay[], selectedMonth: number) => {
  const year = new Date().getFullYear();
  const month = selectedMonth || new Date().getMonth() + 1; // 1-based month
  // Sum total duration and count work days in this period
  let totalMinutesInPeriod = 0;
  let workDaysInPeriod = 0;

  const periodStart = new Date(year, month - 2, 20); // previous month 20th
  const periodEnd = new Date(year, month - 1, 20); // current month 20th
  periodStart.setHours(0, 0, 0, 0);
  periodEnd.setHours(23, 59, 59, 999);

  timeSheets.forEach(({ date, employee_attendances }) => {
    const d = parseDate(date);
    if (d >= periodStart && d <= periodEnd) {
      let dayDuration = 0;
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
  const meetsThreshold = avgMinutesPerDay >= DAY_9_30_HOURS; // 9.5 hours in minutes
  return {
    totalMinutesInPeriod,
    workDaysInPeriod,
    avgMinutesPerDay,
    meetsThreshold,
    periodStart,
    periodEnd,
  };
};

export default getData;
