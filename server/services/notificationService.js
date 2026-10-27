/**
 * Notification service simulating sending email and SMS ticket confirmations
 */
const sendBookingConfirmation = async (booking, user, movie, cinema, show) => {
  console.log(`\n========================================`);
  console.log(`📧 [MOCK EMAIL DISPATCH] Booking Confirmation`);
  console.log(`To: ${user.name} <${user.email}>`);
  console.log(`Booking Reference: ${booking.bookingReference}`);
  console.log(`Movie: ${movie.title} | Cinema: ${cinema.name} (${show.screenName})`);
  console.log(`Date & Time: ${show.showDate} at ${show.startTime}`);
  console.log(`Seats: ${booking.selectedSeats.map((s) => s.seatId).join(', ')}`);
  console.log(`Total Paid: $${booking.totalAmount.toFixed(2)}`);
  console.log(`Status: Confirmed`);
  console.log(`========================================\n`);

  return {
    delivered: true,
    channel: 'email',
    recipient: user.email,
    sentAt: new Date(),
  };
};

const sendCancellationNotice = async (booking, user) => {
  console.log(`\n========================================`);
  console.log(`⚠️ [MOCK EMAIL DISPATCH] Booking Cancellation`);
  console.log(`To: ${user.name} <${user.email}>`);
  console.log(`Booking Reference: ${booking.bookingReference}`);
  console.log(`Status: Cancelled. Refund of $${booking.totalAmount.toFixed(2)} initiated.`);
  console.log(`========================================\n`);

  return {
    delivered: true,
    channel: 'email',
    recipient: user.email,
  };
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationNotice,
};
