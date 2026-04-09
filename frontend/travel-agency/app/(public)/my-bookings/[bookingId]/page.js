import BookingDetailsPageClient from "@/components/bookings/BookingDetailsPageClient";
import { getBookingByIdServer } from "@/lib/api/booking-server";

export default async function BookingDetailsPage({ params }) {
  const { bookingId } = await params;

  let booking = null;

  try {
    booking = await getBookingByIdServer(bookingId);
  } catch {
    booking = null;
  }

  return <BookingDetailsPageClient booking={booking} />;
}
