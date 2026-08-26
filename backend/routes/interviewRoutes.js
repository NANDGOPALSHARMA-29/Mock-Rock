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

const {generateQuestion} = require("../controllers/interviewController");

const router = express.Router();

router.post("/generate", generateQuestion);

module.exports = router;