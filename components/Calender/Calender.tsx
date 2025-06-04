type CalendarProps = {
  month: number;
  calendarDates: string[];
  attendanceByDate: {
    [date: string]: {
      clockIn: string;
      clockOut: string;
      total: number;
    };
  };
  holidays: { [date: string]: string };
  leave: { [date: string]: { leaveTypeName: string } };
};

interface FormatDuration {
  (minutes: number): string;
}

interface ToDate {
  (dateStr: string): Date;
}
export default function Calendar({
  month,
  calendarDates,
  attendanceByDate,
  holidays,
  leave,
}: CalendarProps) {
  // Helper function to format duration in HH:MM
  const formatDuration: FormatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  // Helper function to convert date string to Date object
  const toDate: ToDate = (dateStr) => new Date(dateStr);

  // Render the calendar header with day names
  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-2 text-center font-semibold border-b pb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDates.map((dateStr) => {
          const d = toDate(dateStr);
          const isCurrentMonth = d.getMonth() + 1 === month;
          const attendances = attendanceByDate[dateStr] || [];
          const clockIn = attendances.clockIn
            ? new Date(attendances.clockIn).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-";
          const clockOut = attendances.clockOut
            ? new Date(attendances.clockOut).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-";
          const workedMinutes = attendanceByDate[dateStr]?.total || 0;
          const worked = clockIn !== "-";
          const isHoliday = holidays.hasOwnProperty(dateStr);
          const holidayName = holidays[dateStr];
          const isLeave = leave.hasOwnProperty(dateStr);
          const leaveInfo = leave[dateStr];

          // Set base classes and color with priorities:
          // Leave > Holiday > Worked > Normal
          let containerClasses = `p-2 border h-24 flex flex-col justify-between rounded cursor-default break-words `;
          let tooltip = "";
          if (isLeave) {
            containerClasses +=
              "bg-yellow-300 border-yellow-600 text-yellow-900";
            tooltip = `Leave: ${leaveInfo.leaveTypeName}`;
          } else if (isHoliday) {
            containerClasses += "bg-red-300 border-red-600 text-red-900";
            tooltip = `Holiday: ${holidayName}`;
          } else if (worked) {
            containerClasses += isCurrentMonth
              ? "bg-green-200 border-green-400 text-green-900"
              : "bg-green-100 border-green-300 text-green-700 opacity-80";
            tooltip = `Worked ${formatDuration(workedMinutes)}`;
          } else {
            containerClasses += isCurrentMonth
              ? "bg-white text-black border-gray-300"
              : "bg-gray-100 text-gray-400 border-gray-300";
            tooltip = "No work";
          }

          return (
            <div
              key={dateStr}
              className={containerClasses}
              title={tooltip || ""}
            >
              <div className="text-sm font-medium">{d.getDate()}</div>
              {isLeave && (
                <div className="mt-auto text-xs font-semibold break-words">
                  {leaveInfo.leaveTypeName}
                </div>
              )}
              {worked && (
                <div className="text-xs text-green-800 flex flex-col ">
                  <span>In: {clockIn}</span>
                  <span>Out: {clockOut}</span>
                  <span>Total: {formatDuration(workedMinutes)}</span>
                </div>
              )}
              {isHoliday && (
                <div className="mt-auto text-xs font-semibold">
                  {holidayName}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
