import MonthlySummary from "./MonthlySummary";
import getData from "./data";

export default function MonthlySummaryWrapper({
  timeSheets,
  selectedMonth,
}: {
  timeSheets: AttendanceDay[];
  selectedMonth: number;
}) {
  const {
    totalMinutesInPeriod,
    workDaysInPeriod,
    avgMinutesPerDay,
    meetsThreshold,
    periodStart,
    periodEnd,
  } = getData(timeSheets, selectedMonth);
  return (
    <MonthlySummary
      totalMinutesInPeriod={totalMinutesInPeriod}
      workDaysInPeriod={workDaysInPeriod}
      avgMinutesPerDay={avgMinutesPerDay}
      meetsThreshold={meetsThreshold}
      periodStart={periodStart}
      periodEnd={periodEnd}
    />
  );
}
