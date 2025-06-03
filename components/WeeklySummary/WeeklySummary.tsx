import { MINUTES_40_HOURS } from "../../util/constants";
import { getISOWeekStart, formatWeekRange, formatDuration } from "../../util/helper";

export default function WeeklySummary({
  weeklySummaries,
}: {
  weeklySummaries: Record<string, number>;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">
        Weekly Work Summary (40 hours threshold)
      </h3>
      <div className="space-y-2">
        {Object.entries(weeklySummaries).map(([weekKey, totalMinutes]) => {
          const metThreshold = totalMinutes >= MINUTES_40_HOURS;
          const [yearStr, weekStr] = weekKey.split("-W");
          const y = Number(yearStr);
          const w = Number(weekStr);
          const weekStartDate = getISOWeekStart(y, w);
          const weekRangeStr = formatWeekRange(weekStartDate);

          return (
            <div
              key={weekKey}
              className={`p-3 border rounded flex justify-between items-center text-black ${
                metThreshold
                  ? "bg-green-100 border-green-400"
                  : "bg-red-100 border-red-400"
              }`}
            >
              <div className="font-medium">
                Week {w} ({weekRangeStr})
              </div>
              <div>
                <span className="font-semibold">
                  {formatDuration(totalMinutes)}
                </span>
                {metThreshold ? (
                  <span className="text-green-700 font-bold">✔ Met 40h</span>
                ) : (
                  <span className="text-red-700 font-bold">✘ Below 40h</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
