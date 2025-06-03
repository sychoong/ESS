import { formatDate, formatDuration } from "../../util/helper";

type MonthlySummaryProps = {
  totalMinutesInPeriod: number;
  workDaysInPeriod: number;
  avgMinutesPerDay: number;
  meetsThreshold: boolean;
  periodStart: Date;
  periodEnd: Date;
};

export default function MonthlySummary({
  totalMinutesInPeriod,
  workDaysInPeriod,
  avgMinutesPerDay,
  meetsThreshold,
  periodStart,
  periodEnd,
}: MonthlySummaryProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      {/* existing calendar and weekly summaries */}

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
            ? "✓ Meets 9.5 hours/day target"
            : "✗ Below 9.5 hours/day"}
        </p>
      </div>
    </div>
  );
}
