import MonthlySummary from "./MonthlySummary";
import getData from "./data";

export default function MonthlySummaryWrapper({
  timeSheets,
  selectedMonth,
  replacementLeaveHours,
  currentMonth,
}: {
  timeSheets: AttendanceDay[];
  selectedMonth: number;
  replacementLeaveHours: number;
  currentMonth: number;
}) {
  const {
    totalMinutesInPeriod,
    workDaysInPeriod,
    avgMinutesPerDay,
    meetsThreshold,
    periodStart,
    periodEnd,
    expectedClockOut,
    workHoursLeft,
    normalClockOut
  } = getData(timeSheets, selectedMonth, replacementLeaveHours, currentMonth);
  return (
    <MonthlySummary
      totalMinutesInPeriod={totalMinutesInPeriod}
      workDaysInPeriod={workDaysInPeriod}
      avgMinutesPerDay={avgMinutesPerDay}
      meetsThreshold={meetsThreshold}
      periodStart={periodStart}
      periodEnd={periodEnd}
      expectedClockOut={expectedClockOut ?? undefined}
      workHoursLeft={workHoursLeft}
      normalClockOut={normalClockOut ?? undefined}
    />
  );
}
