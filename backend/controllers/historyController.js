
const Interview = require("../models/Interview");

const saveInterview = async (req, res) => {
  try {
    const { role, experience, difficulty, results } = req.body;

    if (
      typeof role !== "string" ||
      typeof experience !== "string" ||
      typeof difficulty !== "string" ||
      !role.trim() ||
      !experience.trim() ||
      !difficulty.trim()
    ) {
      return res.status(400).json({
        message: "Role, experience and difficulty are required.",
      });
    }

    if (!Array.isArray(results) || results.length !== 3) {
      return res.status(400).json({
        message: "A completed interview must contain 3 questions.",
      });
    }

    for (const result of results) {
      if (
        !result ||
        typeof result.question !== "string" ||
        !result.question.trim() ||
        typeof result.answer !== "string" ||
        typeof result.evaluation !== "string" ||
        typeof result.questionNumber !== "number" ||
        !Number.isFinite(result.questionNumber)
      ) {
        return res.status(400).json({
          message: "Interview result data is invalid.",
        });
      }

      if (
        result.score !== null &&
        result.score !== undefined &&
        (
          typeof result.score !== "number" ||
          !Number.isFinite(result.score) ||
          result.score < 0 ||
          result.score > 10
        )
      ) {
        return res.status(400).json({
          message: "Scores must be between 0 and 10.",
        });
      }
    }

    const cleanResults = results.map((result) => ({
      questionNumber: result.questionNumber,
      question: result.question.trim(),
      answer: result.answer,
      evaluation: result.evaluation,
      score:
        typeof result.score === "number" &&
        Number.isFinite(result.score) &&
        result.score >= 0 &&
        result.score <= 10
          ? result.score
          : null,
    }));

    const scoredResults = cleanResults.filter(
      (result) => result.score !== null
    );

    const totalScore = scoredResults.reduce(
      (sum, result) => sum + result.score,
      0
    );

    const averageScore = scoredResults.length
      ? Number((totalScore / scoredResults.length).toFixed(2))
      : 0;

    const percentage = scoredResults.length
      ? Math.round((totalScore / (scoredResults.length * 10)) * 100)
      : 0;

    const interview = await Interview.create({
      user: req.user._id,
      role: role.trim(),
      experience: experience.trim(),
      difficulty: difficulty.trim(),
      results: cleanResults,
      totalScore,
      averageScore,
      percentage,
    });

    return res.status(201).json({
      message: "Interview saved successfully.",
      interview,
    });
  } catch (error) {
    console.error("Save interview error:", error.message);

    return res.status(500).json({
      message: "Could not save interview history.",
    });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    })
      .select("-user")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ interviews });
  } catch (error) {
    console.error("Get history error:", error.message);

    return res.status(500).json({
      message: "Could not load interview history.",
    });
  }
};

module.exports = {
  saveInterview,
  getInterviewHistory,
};
