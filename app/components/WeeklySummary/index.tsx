import getData from "./data";
import WeeklySummary from "./WeeklySummary";

export default function WeeklySummaryWrapper({
  timeSheets,
}: {
  timeSheets: AttendanceDay[];
}) {
  const { weeklySummaries } = getData(timeSheets);

  return <WeeklySummary weeklySummaries={weeklySummaries} />;
}
