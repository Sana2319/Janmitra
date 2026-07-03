import { Schema, models, model } from "mongoose";

const FeedbackSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    ward: {
      type: String,
      trim: true,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Other",
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },

    department: {
  type: String,
  default: "Other",
},

recommendedAction: {
  type: String,
  default: "",
},

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved"
      ],
      default: "Pending",
    },

    keywords: [
      {
        type: String,
      },
    ],

    aiConfidence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Feedback || model("Feedback", FeedbackSchema);