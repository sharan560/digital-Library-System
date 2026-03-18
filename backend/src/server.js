const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { startFineCron } = require("./cron/fineCron");
const { hasEmailConfig, verifyEmailTransport } = require("./services/emailService");

dotenv.config();

const PORT = process.env.PORT || 5000;

const boot = async () => {
  await connectDB();

  if (hasEmailConfig()) {
    const result = await verifyEmailTransport();
    if (result.ok) {
      console.log("SMTP ready");
    } else {
      console.warn(`SMTP check failed: ${result.reason}`);
    }
  } else {
    console.warn("SMTP config not set. Email features are disabled.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startFineCron();
};

boot();
