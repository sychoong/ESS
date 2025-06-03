import Link from "next/link";

type MonthSelectorProps = {
  selectedMonth: number;
  currentMonth: number;
  startDate: string | number | Date;
};

export default function MonthSelector({
  selectedMonth,
  currentMonth,
  startDate,
}: MonthSelectorProps) {
  return (
    <div className="grid grid-cols-3 justify-between items-center mb-4">
      <div className="mx-auto">
        <Link
          href={`?month=${selectedMonth - 1}`}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          &lt; Prev
        </Link>
      </div>

      <h2 className="text-xl font-semibold mx-auto">
        {new Date(startDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="mx-auto">
        {selectedMonth != currentMonth ? (
          <Link
            href={`?month=${selectedMonth + 1}`}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Next Month
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
