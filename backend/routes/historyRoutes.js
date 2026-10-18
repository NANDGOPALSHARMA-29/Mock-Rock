
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  saveInterview,
  getInterviewHistory,
} = require("../controllers/historyController");

router.post("/", protect, saveInterview);
router.get("/", protect, getInterviewHistory);

module.exports = router;
