import express from "express";
import rateLimit from "express-rate-limit";
import {
  createGroupController,
  joinGroupController,
  getGroupStatusController,
} from "../controllers/groupController.js";

const router = express.Router();

// Apply rate limiting specifically to group routes
const groupLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, error: "Too many requests, try again later" },
});

router.use(groupLimiter);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new group
 *     description: Creates a group with a defined maximum number of participants and optional name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - maxParticipants
 *             properties:
 *               maxParticipants:
 *                 type: integer
 *                 minimum: 2
 *                 example: 5
 *               name:
 *                 type: string
 *                 example: "Room 1"
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     roomCode:
 *                       type: string
 *                     name:
 *                       type: string
 *                     maxParticipants:
 *                       type: integer
 *                     participants:
 *                       type: integer
 *                     isComplete:
 *                       type: boolean
 *                     isExpired:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                     timeLeftMs:
 *                       type: integer
 */
router.post("/", createGroupController);

/**
 * @swagger
 * /groups/{roomCode}/join:
 *   post:
 *     summary: Join an existing group
 *     description: Allows a user to join a group using its unique roomCode.
 *     parameters:
 *       - in: path
 *         name: roomCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique room code of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Joined group successfully or group is now full
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     roomCode:
 *                       type: string
 *                     name:
 *                       type: string
 *                     maxParticipants:
 *                       type: integer
 *                     participants:
 *                       type: integer
 *                     isComplete:
 *                       type: boolean
 *                     isExpired:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                     timeLeftMs:
 *                       type: integer
 */
router.post("/:roomCode/join", joinGroupController);

/**
 * @swagger
 * /groups/{roomCode}:
 *   get:
 *     summary: Get group status
 *     description: Fetches current status of a group, including participants, completion, and expiry.
 *     parameters:
 *       - in: path
 *         name: roomCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique room code of the group
 *     responses:
 *       200:
 *         description: Group status fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     roomCode:
 *                       type: string
 *                     name:
 *                       type: string
 *                     participants:
 *                       type: integer
 *                     maxParticipants:
 *                       type: integer
 *                     isComplete:
 *                       type: boolean
 *                     isExpired:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                     timeLeftMs:
 *                       type: integer
 */
router.get("/:roomCode", getGroupStatusController);

export default router;
