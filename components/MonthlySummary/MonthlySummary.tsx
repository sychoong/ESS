import { formatDate, formatDuration, formatTimeIn12Hour } from "../../util/helper";
import CountdownTimer from "../CountdownTimer";

type MonthlySummaryProps = {
  totalMinutesInPeriod: number;
  workDaysInPeriod: number;
  avgMinutesPerDay: number;
  meetsThreshold: boolean;
  periodStart: Date;
  periodEnd: Date;
  expectedClockOut?: Date; // Optional prop for expected clock out time
};

export default function MonthlySummary({
  totalMinutesInPeriod,
  workDaysInPeriod,
  avgMinutesPerDay,
  meetsThreshold,
  periodStart,
  periodEnd,
  expectedClockOut, // Optional prop for expected clock out time
}: MonthlySummaryProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      {/* existing calendar and weekly summaries */}
      {expectedClockOut && (
        <CountdownTimer targetDate={expectedClockOut} />
      )}

      {/* Monthly summary: 20th previous month - 20th current month */}
      <div className="mt-8 p-4 border rounded bg-blue-50 border-blue-300">
        <h3 className="text-xl font-semibold mb-2">
          Monthly Summary (20th to 20th)
        </h3>
        <p>
          Period: <strong>{formatDate(periodStart)}</strong> to{" "}
          <strong>{formatDate(periodEnd)}</strong>
        </p>
        <p>
          Total Worked Hours:{" "}
          <strong>{formatDuration(totalMinutesInPeriod)}</strong>
        </p>
        <p>
          Work Days: <strong>{workDaysInPeriod}</strong>
        </p>
        {expectedClockOut && (
          <p>
            Expected Clock Out:{" "}
            <strong className="text-blue-700">{formatTimeIn12Hour(expectedClockOut)}</strong>
          </p>
        )}
        <p>
          Average Hours per Workday:{" "}
          <strong>{formatDuration(Math.round(avgMinutesPerDay))}</strong>
        </p>
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
