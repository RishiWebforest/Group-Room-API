import Group from "../models/groupModel.js";
import logger from "../utils/logger.js";

const formatGroupResponse = (group) => {
  const timeLeft =
    group.isExpired || group.isComplete
      ? 0
      : Math.max(0, group.expiresAt.getTime() - Date.now());

  return {
    id: group._id,
    roomCode: group.roomCode,
    name: group.name,
    participants: group.participants.length,
    maxParticipants: group.maxParticipants,
    isComplete: group.isComplete,
    isExpired: group.isExpired,
    createdAt: group.createdAt,
    expiresAt: group.expiresAt,
    timeLeftMs: timeLeft,
  };
};

/**
 * Create a new group
 */
export const createGroup = async (maxParticipants, name) => {
  const expiresAt = new Date(Date.now() + process.env.GROUP_EXPIRY_MINUTES * 60000);

  const group = await Group.create({
    maxParticipants,
    name,
    participants: [],
    expiresAt,
  });

  logger.info(
    `Group created: ${group.roomCode} | Name: ${name || "N/A"} | Max Participants: ${maxParticipants}`
  );

  return formatGroupResponse(group);
};

/**
 * Join a group using roomCode
 */
export const joinGroup = async (roomCode, userId) => {
  const group = await Group.findOne({ roomCode });

  if (!group) {
    logger.warn(`Join attempt failed: Group not found (${roomCode})`);
    throw new Error("Group not found");
  }

  // Expiry fallback
  if (!group.isExpired && Date.now() > group.expiresAt.getTime()) {
    group.isExpired = true;
    await group.save();
    logger.info(`Group expired during join: ${roomCode}`);
    throw new Error("Group has expired");
  }

  if (group.isExpired) {
    logger.info(`Join attempt failed: Group expired (${roomCode})`);
    throw new Error("Group has expired");
  }

  if (group.isComplete) {
    logger.info(`Join attempt failed: Group complete (${roomCode})`);
    throw new Error("Group is already complete");
  }

  if (group.participants.includes(userId)) {
    logger.info(`User ${userId} already in group ${roomCode}`);
    throw new Error("User already joined this group");
  }

  group.participants.push(userId);

  if (group.participants.length >= group.maxParticipants) {
    group.isComplete = true;
    logger.info(`Group is now full: ${roomCode}`);
  } else {
    logger.info(`User ${userId} joined group ${roomCode}`);
  }

  await group.save();
  return formatGroupResponse(group);
};

/**
 * Get group status using roomCode
 */
export const getGroupStatus = async (roomCode) => {
  const group = await Group.findOne({ roomCode });

  if (!group) {
    logger.warn(`Status fetch failed: Group not found (${roomCode})`);
    throw new Error("Group not found");
  }

  if (!group.isExpired && Date.now() > group.expiresAt.getTime()) {
    group.isExpired = true;
    await group.save();
    logger.info(`Group expired on status fetch: ${roomCode}`);
  }

  return formatGroupResponse(group);
};
