import { getBookingStatusClasses } from "@/lib/utils/booking";

export default function BookingStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize backdrop-blur-md ${getBookingStatusClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}
