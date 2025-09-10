// utils/cron.js
import cron from "node-cron";
import Group from "../models/groupModel.js";
import logger from "./logger.js";

/**
 * Schedule a cron job to mark expired groups proactively.
 */
export const scheduleExpiryCheck = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    try {
      const result = await Group.updateMany(
        { isExpired: false, expiresAt: { $lte: now } },
        { isExpired: true }
      );

      if (result.modifiedCount > 0) {
        logger.info(`[Cron] Marked ${result.modifiedCount} group(s) as expired at ${now.toISOString()}`);
      }
    } catch (err) {
      logger.error(`[Cron] Error updating expired groups: ${err.message}`);
    }
  });

  logger.info("[Cron] Expiry check scheduled to run every minute.");
};
