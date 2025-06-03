import { parseDate, getISOWeek } from "@/util/helper";

const getData = (timeSheets: AttendanceDay[]) => {
  // Weekly summaries grouped by `${year}-W${week}`
  const weeklySummaries: Record<string, number> = {};
  timeSheets.forEach(({ date, employee_attendances }) => {
    let total = 0;
    employee_attendances.forEach((ea) => {
      if (ea.duration) total += ea.duration;
    });
    const d = parseDate(date);
    const { year, week } = getISOWeek(d);
    const weekKey = `${year}-W${week}`;
    if (!weeklySummaries[weekKey]) weeklySummaries[weekKey] = 0;
    weeklySummaries[weekKey] += total;
  });

  return {
    weeklySummaries,
  };
};

export default getData;
