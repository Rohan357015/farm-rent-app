import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["farmer", "supplier"],
      required: true,
    },

    receiverRole: {
      type: String,
      enum: ["farmer", "supplier"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
connectionSchema.index({ senderId: 1, status: 1, updatedAt: -1 });
connectionSchema.index({ receiverId: 1, status: 1, updatedAt: -1 });

const Connection = mongoose.model("Connection", connectionSchema);
export default Connection;
