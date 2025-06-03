import getAttendance from "@/app/action/getAttendance";
import getLeave from "@/app/action/getLeave";
import MonthSelector from "@/app/components/MonthSelector";
import WeeklySummaryWrapper from "@/app/components/WeeklySummary";
import MonthlySummaryWrapper from "@/app/components/MonthlySummary";
import CalendarWrapper from "@/app/components/Calender";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "@/app/util/helper";

export default async function Report({
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;
  const month =
    parseInt(searchParamsObj.month as string, 10) || new Date().getMonth() + 1;
  if (isNaN(month) || month < 1 || month > 12) {
    return <h1>Invalid month parameter</h1>;
  }

  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startDate = new Date(year, month - 1, 1);
  const startMonth = startOfMonth(startDate);
  const calendarStart = startOfWeek(startMonth);
  const endMonth = endOfMonth(startDate);
  const calendarEnd = endOfWeek(endMonth);
  const { timeSheets, holidays: holidaysData } = await getAttendance(
    calendarStart.toISOString().split("T")[0],
    calendarEnd.toISOString().split("T")[0]
  );

  const leave = await getLeave(
    calendarStart.toISOString().split("T")[0],
    calendarEnd.toISOString().split("T")[0]
  );
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Employee Attendance Calendar
      </h1>
      <MonthSelector
        selectedMonth={month}
        currentMonth={currentMonth}
        startDate={startDate}
      />

      <CalendarWrapper
        timeSheets={timeSheets}
        selectedMonth={month}
        holidays={holidaysData}
        leave={leave}
      />

      <WeeklySummaryWrapper timeSheets={timeSheets} />

      <MonthlySummaryWrapper selectedMonth={month} timeSheets={timeSheets} />
    </div>
  );
}
