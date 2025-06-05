import ClockInButton from "./ClockInButton";

export default function ClockIn({
  timeSheets,
  id,
}: {
  timeSheets: AttendanceDay[];
  id: string;
}) {
  return (
    <ClockInButton id={id} show={true} clockInOrOut={false}></ClockInButton>
  );
}
