export const welcomeEmailTemplate = ({ name }) => ({
  subject: "Welcome to Travel Agency",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#0f172a,#0891b2); padding:32px; color:#fff;">
          <h1 style="margin:0; font-size:28px;">Welcome, ${name || "Traveler"} ✨</h1>
          <p style="margin-top:12px; color:rgba(255,255,255,0.85);">
            Your premium travel journey starts here.
          </p>
        </div>

        <div style="padding:32px; color:#334155;">
          <p style="line-height:1.8;">
            Thank you for joining Travel Agency. You can now explore curated destinations,
            luxury stays, and handpicked travel packages with a smoother premium experience.
          </p>

          <p style="line-height:1.8;">
            We’re excited to help you plan unforgettable journeys.
          </p>

          <a
            href="http://localhost:3000/packages"
            style="display:inline-block; margin-top:16px; background:#0891b2; color:#fff; text-decoration:none; padding:12px 20px; border-radius:999px; font-weight:600;"
          >
            Explore Packages
          </a>
        </div>
      </div>
    </div>
  `,
});

export const bookingConfirmationTemplate = ({
  name,
  bookingId,
  packageTitle,
  travelDate,
  numberOfPeople,
  totalPrice,
}) => ({
  subject: "Your Booking is Confirmed",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#0f172a,#0891b2); padding:32px; color:#fff;">
          <h1 style="margin:0; font-size:28px;">Booking Confirmed 🎉</h1>
          <p style="margin-top:12px; color:rgba(255,255,255,0.85);">
            Hi ${name || "Traveler"}, your trip is reserved.
          </p>
        </div>

        <div style="padding:32px; color:#334155;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Package:</strong> ${packageTitle}</p>
          <p><strong>Travel Date:</strong> ${travelDate}</p>
          <p><strong>Travelers:</strong> ${numberOfPeople}</p>
          <p><strong>Total:</strong> ₹${totalPrice}</p>

          <a
            href="http://localhost:3000/my-bookings"
            style="display:inline-block; margin-top:16px; background:#0891b2; color:#fff; text-decoration:none; padding:12px 20px; border-radius:999px; font-weight:600;"
          >
            View My Bookings
          </a>
        </div>
      </div>
    </div>
  `,
});

export const paymentSuccessTemplate = ({
  name,
  bookingId,
  packageTitle,
  totalPrice,
}) => ({
  subject: "Payment Successful",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#065f46,#06b6d4); padding:32px; color:#fff;">
          <h1 style="margin:0; font-size:28px;">Payment Received ✅</h1>
          <p style="margin-top:12px; color:rgba(255,255,255,0.85);">
            Your payment has been successfully verified.
          </p>
        </div>

        <div style="padding:32px; color:#334155;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Package:</strong> ${packageTitle}</p>
          <p><strong>Amount Paid:</strong> ₹${totalPrice}</p>

          <a
            href="http://localhost:3000/my-bookings"
            style="display:inline-block; margin-top:16px; background:#0891b2; color:#fff; text-decoration:none; padding:12px 20px; border-radius:999px; font-weight:600;"
          >
            View Booking
          </a>
        </div>
      </div>
    </div>
  `,
});

export const bookingCancelledTemplate = ({
  name,
  bookingId,
  packageTitle,
  travelDate,
  totalPrice,
}) => ({
  subject: "Your Booking Has Been Cancelled",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#7f1d1d,#dc2626); padding:32px; color:#fff;">
          <h1 style="margin:0; font-size:28px;">Booking Cancelled</h1>
          <p style="margin-top:12px; color:rgba(255,255,255,0.85);">
            Hi ${name || "Traveler"}, your booking has been cancelled successfully.
          </p>
        </div>

        <div style="padding:32px; color:#334155;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Package:</strong> ${packageTitle}</p>
          <p><strong>Travel Date:</strong> ${travelDate}</p>
          <p><strong>Amount:</strong> ₹${totalPrice}</p>

          <a
            href="http://localhost:3000/my-bookings"
            style="display:inline-block; margin-top:16px; background:#dc2626; color:#fff; text-decoration:none; padding:12px 20px; border-radius:999px; font-weight:600;"
          >
            View My Bookings
          </a>
        </div>
      </div>
    </div>
  `,
});
