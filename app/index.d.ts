declare global {
  interface EmployeeAttendance {
    id: number;
    clock_in: string;
    clock_out: string | null;
    duration: number | null;
  }

  interface AttendanceDay {
    date: string; // YYYY-MM-DD
    employee_attendances: EmployeeAttendance[];
  }

  interface Holiday {
    date: string; // YYYY-MM-DD
    holiday_name: string;
  }
  interface Leave {
    startDate: string;
    endDate: string;
    leaveType: string;
    hourApplied: number;
  }
}
export {};
