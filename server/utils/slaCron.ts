import cron from "node-cron";
import { checkAndMarkOverdue } from "../controllers/issue.controller";

cron.schedule("*/10 * * * *", async () => {
  await checkAndMarkOverdue();
});
