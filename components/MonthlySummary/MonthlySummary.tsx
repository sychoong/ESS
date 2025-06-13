import { MINUTES_8_HOURS } from "@/util/constants";
import {
  formatDate,
  formatDuration,
  formatTimeIn12Hour,
} from "@/util/helper";
import CountdownTimer from "@/components/CountdownTimer";

type MonthlySummaryProps = {
  totalMinutesInPeriod: number;
  workDaysInPeriod: number;
  avgMinutesPerDay: number;
  meetsThreshold: boolean;
  periodStart: Date;
  periodEnd: Date;
  expectedClockOut?: Date; // Optional prop for expected clock out time
  workHoursLeft: number; // Remaining work hours in minutes
  normalClockOut?: Date; // Optional prop for normal clock out time
  lastAttendance?: EmployeeAttendance;
};

export default function MonthlySummary({
  totalMinutesInPeriod,
  workDaysInPeriod,
  avgMinutesPerDay,
  meetsThreshold,
  periodStart,
  periodEnd,
  expectedClockOut, // Optional prop for expected clock out time
  workHoursLeft,
  normalClockOut, // Optional prop for normal clock out time
  lastAttendance,
}: MonthlySummaryProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      {/* existing calendar and weekly summaries */}
      {expectedClockOut && <CountdownTimer targetDate={expectedClockOut} />}

      {/* Monthly summary: 20th previous month - 20th current month */}
      <div className="mt-8 p-4 border rounded bg-blue-50 border-blue-300 items-center flex flex-col">
        <h3 className="text-xl font-semibold mb-2">
          Monthly Summary <strong>{formatDate(periodStart)}</strong> to{" "}
          <strong>{formatDate(periodEnd)}</strong>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div>
            <p>
              Should Worked Hours:{" "}
              <strong>
                {formatDuration(workDaysInPeriod * MINUTES_8_HOURS)}
              </strong>
            </p>
            <p>
              Total Worked Hours:{" "}
              <strong>{formatDuration(totalMinutesInPeriod)}</strong>
            </p>
            <p>
              Work Hours Left: <strong>{formatDuration(workHoursLeft)}</strong>
            </p>
            <p>
              Work Days: <strong>{workDaysInPeriod}</strong>
            </p>
          </div>
          <div>
            <p>
              Clock In Today:
              <strong className="text-blue-700">
                {new Date(lastAttendance?.clock_in || "").toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </strong>
            </p>
            <p>
              Clock Out Today:{" "}
              <strong className="text-blue-700">
                {new Date(lastAttendance?.clock_out || "").toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </strong>
            </p>
            {expectedClockOut && (
              <p>
                Expected Clock Out:{" "}
                <strong className="text-blue-700">
                  {formatTimeIn12Hour(expectedClockOut)}
                </strong>
              </p>
            )}
            {normalClockOut && (
              <p>
                Normal Clock Out:{" "}
                <strong className="text-blue-700">
                  {formatTimeIn12Hour(normalClockOut)}
                </strong>
              </p>
            )}
            <p>
              Average Hours per Workday:{" "}
              <strong
                className={
                  meetsThreshold
                    ? "text-green-700 font-bold"
                    : "text-red-700 font-bold"
                }
              >
                {formatDuration(Math.round(avgMinutesPerDay))}
              </strong>
            </p>
          </div>
        </div>

        <p
          className={
            meetsThreshold
              ? "text-green-700 font-bold"
              : "text-red-700 font-bold"
          }
        >
          {meetsThreshold
            ? "✓ Meets 8 hours/day target"
            : "✗ Below 8 hours/day"}
        </p>
      </div>
    </div>
  );
}
