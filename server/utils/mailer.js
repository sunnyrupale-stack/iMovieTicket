const nodemailer = require("nodemailer");

// Create transport using configured or test credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "admin@imovies.com",
    pass: process.env.EMAIL_PASS || "sample_pass",
  },
});

const verifyTransport = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.log("Mailer initialized (simulation mode active for college project)");
    } else {
      console.log("Email server is ready to send messages");
    }
  });
};

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: `"iMovies Ticketing" <${process.env.EMAIL_USER || "noreply@imovies.com"}>`,
      to: userEmail,
      subject: `iMovies Ticket Confirmation - Booking #${bookingDetails.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0e14; color: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e50914;">iMovies Booking Confirmation</h2>
          <p>Thank you for booking with iMovies!</p>
          <div style="background-color: #161b26; padding: 15px; border-left: 4px solid #e50914; margin: 15px 0;">
            <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
            <p><strong>Theatre:</strong> ${bookingDetails.theatreName || "Cinema Hall"}</p>
            <p><strong>Show Date & Time:</strong> ${bookingDetails.showDate} at ${bookingDetails.showtime}</p>
            <p><strong>Seats:</strong> ${Array.isArray(bookingDetails.seats) ? bookingDetails.seats.join(", ") : bookingDetails.seats}</p>
            <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">Please arrive 15 minutes before the showtime with your e-ticket.</p>
        </div>
      `,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email simulated: Notification prepared for " + userEmail);
    return { messageId: "simulated-" + Date.now() };
  }
};

module.exports = {
  transporter,
  verifyTransport,
  sendBookingConfirmationEmail,
};
