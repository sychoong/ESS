import getAttendance from "@/action/getAttendance";
import getLeave from "@/action/getLeave";
import MonthSelector from "@/components/MonthSelector";
import MonthlySummaryWrapper from "@/components/MonthlySummary";
import CalendarWrapper from "@/components/Calender";
import { endOfMonth, endOfWeek, parseDate } from "@/util/helper";
import { REPLACEMENT_HOURS } from "@/util/constants";
import getUserInfo from "@/action/gerUserInfo";
import ClockIn from "@/components/ClockIn";

export const dynamic = "force-dynamic";

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

  const calendarStart = new Date(year, month - 2, 20); // Previous month 20th
  const calendarEnd = endOfWeek(endOfMonth(startDate));
  const { timeSheets, holidays: holidaysData } = await getAttendance(
    calendarStart.toISOString().split("T")[0],
    calendarEnd.toISOString().split("T")[0]
  );

  const periodStart = new Date(year, month - 2, 21); // previous month 21st
  const periodEnd = new Date(year, month - 1, 20);

  const leave = await getLeave(
    calendarStart.toISOString().split("T")[0],
    calendarEnd.toISOString().split("T")[0]
  );

  const replacementLeaveHours = leave
    .filter(
      (l) =>
        l.leaveType === REPLACEMENT_HOURS &&
        parseDate(l.startDate) >= periodStart &&
        parseDate(l.endDate) <= periodEnd
    )
    .reduce((total, l) => total + l.hourApplied, 0);

  const userInfo = await getUserInfo();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Hi, {userInfo.name} (id: {userInfo.id})
      </h1>

      <MonthSelector
        selectedMonth={month}
        currentMonth={currentMonth}
        startDate={startDate}
      />
      {currentMonth === month ? (
        <ClockIn id={userInfo.id} timeSheets={timeSheets}/>
      ) : (
        <></>
      )}

      <MonthlySummaryWrapper
        selectedMonth={month}
        timeSheets={timeSheets}
        replacementLeaveHours={replacementLeaveHours}
        currentMonth={currentMonth}
      />

      <CalendarWrapper
        timeSheets={timeSheets}
        selectedMonth={month}
        holidays={holidaysData}
        leave={leave}
      />

      {/* <WeeklySummaryWrapper timeSheets={timeSheets} /> */}
    </div>
  );
}
