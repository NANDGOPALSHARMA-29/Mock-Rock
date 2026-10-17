// const express = require("express");

// const router = express.Router();

// router.post("/generate", (req, res) => {
//     const { role, experience, difficulty } = req.body;

//     console.log("Role:", role);
//     console.log("Experience:", experience);
//     console.log("Difficulty:", difficulty);

//     res.json({
//         question: `This is a ${difficulty} level question for a ${experience} ${role}.`
//     });
// });

// module.exports = router;




const express = require("express");

const {generateQuestion, submitAnswer} = require("../controllers/interviewController");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateQuestion);
router.post("/answer", protect, submitAnswer);

// router.post("/answer", (req, res) => {
//   const { question, answer } = req.body;
//   console.log("Question:", question);
//   console.log("Answer:", answer);

//   res.json({
//     message: "Answer received successfully",
//   });
// });

module.exports = router;