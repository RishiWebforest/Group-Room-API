// controllers/groupController.js
import asyncHandler from "../utils/asyncHandler.js";
import { createGroup, joinGroup, getGroupStatus } from "../services/groupService.js";

// @desc    Create a new group
// @route   POST /api/groups
// @access  Public
export const createGroupController = asyncHandler(async (req, res) => {
  const { maxParticipants, name } = req.body;

  if (!maxParticipants || maxParticipants < 2) {
    res.status(400);
    throw new Error("maxParticipants is required and must be >= 2");
  }

  const group = await createGroup(maxParticipants, name);

  res.status(201).json({
    success: true,
    message: "Group created successfully",
    data: {
      id: group.id,
      roomCode: group.roomCode,
      name: group.name || null,
      maxParticipants: group.maxParticipants,
      participants: group.participants,
      isComplete: group.isComplete,
      isExpired: group.isExpired,
      createdAt: group.createdAt,
      expiresAt: group.expiresAt,
      timeLeftMs: group.timeLeftMs,
    },
  });
});

// @desc    Join an existing group
// @route   POST /api/groups/:roomCode/join
// @access  Public
export const joinGroupController = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("userId is required to join a group");
  }

  const group = await joinGroup(roomCode, userId);

  res.status(200).json({
    success: true,
    message: group.isComplete ? "Group is now full" : "Joined group successfully",
    data: {
      id: group.id,
      roomCode: group.roomCode,
      name: group.name || null,
      maxParticipants: group.maxParticipants,
      participants: group.participants,
      isComplete: group.isComplete,
      isExpired: group.isExpired,
      createdAt: group.createdAt,
      expiresAt: group.expiresAt,
      timeLeftMs: group.timeLeftMs,
    },
  });
});

// @desc    Get group status
// @route   GET /api/groups/:roomCode
// @access  Public
export const getGroupStatusController = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  const group = await getGroupStatus(roomCode);

  res.status(200).json({
    success: true,
    message: "Group status fetched successfully",
    data: {
      id: group.id,
      roomCode: group.roomCode,
      name: group.name || null,
      maxParticipants: group.maxParticipants,
      participants: group.participants,
      isComplete: group.isComplete,
      isExpired: group.isExpired,
      createdAt: group.createdAt,
      expiresAt: group.expiresAt,
      timeLeftMs: group.timeLeftMs,
    },
  });
});
