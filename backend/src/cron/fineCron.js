const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const {
  calculateFine,
  getLateDays,
} = require("../utils/fine");
const { hasEmailConfig, sendFineReminderEmail } = require("../services/emailService");

const updateDailyFines = async () => {
  const now = new Date();
  const pending = await Transaction.find({ status: { $in: ["issued", "overdue"] } });

  await Promise.all(
    pending.map(async (tx) => {
      if (tx.returnDate) return;

      const fine = calculateFine(tx.dueDate, now);
      if (fine > 0) {
        tx.status = "overdue";
        tx.fine = fine;
        await tx.save();
      }
    })
  );
};

const notifyOverdueFines = async () => {
  if (!hasEmailConfig()) {
    return;
  }

  const now = new Date();
  const overdueTransactions = await Transaction.find({
    status: "overdue",
    fine: { $gt: 0 },
    isFinePaid: false,
  })
    .populate("userId", "name email emailNotificationsOptIn")
    .populate("bookId", "title");

  await Promise.all(
    overdueTransactions.map(async (tx) => {
      if (!tx.userId?.email || tx.userId.emailNotificationsOptIn === false) {
        return;
      }

      const lastNotifiedAt = tx.lastFineNotifiedAt ? new Date(tx.lastFineNotifiedAt) : null;
      const elapsedHours = lastNotifiedAt
        ? (now - lastNotifiedAt) / (1000 * 60 * 60)
        : 24;

      if (elapsedHours < 24) {
        return;
      }

      if (getLateDays(tx.dueDate, now) < 1) {
        return;
      }

      try {
        await sendFineReminderEmail({
          user: tx.userId,
          book: tx.bookId,
          transaction: tx,
        });

        tx.lastFineNotifiedAt = now;
        tx.fineNotificationCount += 1;
        await tx.save();
      } catch (error) {
        console.error(`Fine email reminder failed for transaction ${tx._id}:`, error.message);
      }
    })
  );
};

const startFineCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await updateDailyFines();
    } catch (error) {
      console.error("Fine cron failed:", error.message);
    }
  });

  cron.schedule("0 9 * * *", async () => {
    try {
      await notifyOverdueFines();
    } catch (error) {
      console.error("Email fine reminder cron failed:", error.message);
    }
  });

  console.log("Daily fine calculation and 9 AM email reminder cron started");
};

module.exports = { startFineCron };
