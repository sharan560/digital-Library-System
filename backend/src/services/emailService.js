const nodemailer = require("nodemailer");
const { getLateDays } = require("../utils/fine");

const hasEmailConfig = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendFineReminderEmail = async ({ user, book, transaction }) => {
  if (!user?.email || user.emailNotificationsOptIn === false || !hasEmailConfig()) {
    return false;
  }

  const lateDays = getLateDays(transaction.dueDate);
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `Overdue fine reminder for ${book?.title || "borrowed book"}`,
    text: `Hello ${user.name || "Member"},\n\nYour borrowed book "${book?.title || "Book"}" is overdue by ${lateDays} day(s). Your current fine is INR ${transaction.fine}. Please return the book as soon as possible to avoid additional charges.\n\nDigital Library System`,
    html: `<p>Hello ${user.name || "Member"},</p><p>Your borrowed book <strong>${book?.title || "Book"}</strong> is overdue by <strong>${lateDays} day(s)</strong>.</p><p>Your current fine is <strong>INR ${transaction.fine}</strong>.</p><p>Please return the book as soon as possible to avoid additional charges.</p><p>Digital Library System</p>`,
  });

  return true;
};

const sendReturnEstimateEmail = async ({ user, book, returnDate, fine }) => {
  if (!user?.email || user.emailNotificationsOptIn === false || !hasEmailConfig()) {
    return false;
  }

  const transporter = getTransporter();
  const formattedReturnDate = new Date(returnDate).toLocaleDateString("en-IN");

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `Return update for ${book?.title || "borrowed book"}`,
    text: `Hello ${user.name || "Member"},\n\nThe library admin has processed your return details for "${book?.title || "Book"}".\nSelected return date: ${formattedReturnDate}\nCalculated fine: INR ${fine}\n\nPlease contact the library desk if you have questions.\n\nDigital Library System`,
    html: `<p>Hello ${user.name || "Member"},</p><p>The library admin has processed your return details for <strong>${book?.title || "Book"}</strong>.</p><p>Selected return date: <strong>${formattedReturnDate}</strong><br/>Calculated fine: <strong>INR ${fine}</strong></p><p>Please contact the library desk if you have questions.</p><p>Digital Library System</p>`,
  });

  return true;
};

module.exports = { hasEmailConfig, sendFineReminderEmail, sendReturnEstimateEmail };
