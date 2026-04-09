import MyBookingsPageClient from "@/components/bookings/MyBookingsPageClient";
import { getMyBookingsServer } from "@/lib/api/booking-server";

export default async function MyBookingsPage() {
  let bookings = [];

  try {
    bookings = await getMyBookingsServer();
  } catch {
    bookings = [];
  }

  return <MyBookingsPageClient initialBookings={bookings} />;
}
