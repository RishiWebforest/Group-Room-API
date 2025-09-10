import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// Generate 6-character alphanumeric room code
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    roomCode: {
      type: String,
      unique: true,
      default: () => nanoid(),
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 2,
    },
    participants: [
      {
        type: String, // userId in real app
        required: true,
      },
    ],
    isComplete: {
      type: Boolean,
      default: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to mark expired groups
groupSchema.pre("save", function (next) {
  if (this.expiresAt && Date.now() > this.expiresAt.getTime()) {
    this.isExpired = true;
  }
  next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
