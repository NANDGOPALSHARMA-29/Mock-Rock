
const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    evaluation: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    results: {
      type: [questionResultSchema],
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    averageScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
