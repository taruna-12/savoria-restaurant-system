const nodemailer = require('nodemailer');

// In-memory alert log store for instant UI preview/inspection
const sentEmailsLog = [];

// Create test transport (or ethereal fallback)
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'mock_savoria@ethereal.email',
      pass: 'mock_pass_123'
    }
  });
} catch (e) {
  console.log('Nodemailer using mock transport logger');
}

const sendBookingConfirmation = async (userEmail, userName, reservationDetails) => {
  const subject = `Reservation Confirmed: Token #${reservationDetails.reservation_token} - Savoria Dining`;
  const textContent = `Dear ${userName},\n\nYour table reservation at Savoria Fine Dining is CONFIRMED!\n\nDetails:\nToken: ${reservationDetails.reservation_token}\nDate: ${reservationDetails.res_date}\nTime Slot: ${reservationDetails.time_slot}\nGuests: ${reservationDetails.guest_count}\nZone: ${reservationDetails.zoneName || 'Main Dining'}\n\nWe look forward to serving you!`;

  const emailRecord = {
    id: 'EML-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    to: userEmail,
    subject,
    type: 'RESERVATION_CONFIRMATION',
    timestamp: new Date().toISOString(),
    content: textContent,
    status: 'DELIVERED',
    metadata: reservationDetails
  };

  sentEmailsLog.unshift(emailRecord);
  if (sentEmailsLog.length > 50) sentEmailsLog.pop();

  console.log(`[EMAIL DISPATCHER] Sent confirmation email to ${userEmail} (Token: ${reservationDetails.reservation_token})`);
  return emailRecord;
};

const sendBookingCancellation = async (userEmail, userName, reservationToken) => {
  const subject = `Reservation Cancelled: Token #${reservationToken} - Savoria Dining`;
  const textContent = `Dear ${userName},\n\nYour table reservation (Token: #${reservationToken}) has been CANCELLED.\nIf this was done by mistake, please contact our support or make a new reservation online.\n\nThank you,\nSavoria Team`;

  const emailRecord = {
    id: 'EML-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    to: userEmail,
    subject,
    type: 'RESERVATION_CANCELLATION',
    timestamp: new Date().toISOString(),
    content: textContent,
    status: 'DELIVERED',
    metadata: { reservationToken }
  };

  sentEmailsLog.unshift(emailRecord);
  if (sentEmailsLog.length > 50) sentEmailsLog.pop();

  console.log(`[EMAIL DISPATCHER] Sent cancellation email to ${userEmail} (Token: ${reservationToken})`);
  return emailRecord;
};

const sendOrderStatusUpdate = async (userEmail, orderNumber, newStatus) => {
  const subject = `Order Update: #${orderNumber} is now ${newStatus} - Savoria Kitchen`;
  const textContent = `Hello,\n\nYour online order #${orderNumber} status has been updated to: ${newStatus}.\n\nThank you for choosing Savoria!`;

  const emailRecord = {
    id: 'EML-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    to: userEmail,
    subject,
    type: 'ORDER_UPDATE',
    timestamp: new Date().toISOString(),
    content: textContent,
    status: 'DELIVERED',
    metadata: { orderNumber, newStatus }
  };

  sentEmailsLog.unshift(emailRecord);
  if (sentEmailsLog.length > 50) sentEmailsLog.pop();

  console.log(`[EMAIL DISPATCHER] Sent order status email to ${userEmail} (Order: ${orderNumber})`);
  return emailRecord;
};

const getEmailLogs = () => sentEmailsLog;

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendOrderStatusUpdate,
  getEmailLogs
};
