const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { startFineCron } = require("./cron/fineCron");

dotenv.config();

const PORT = process.env.PORT || 5000;

const boot = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startFineCron();
};

boot();
