const {
    generateInterviewQuestion,
    evaluateAnswer
} = require("../services/aiService");

const generateQuestion = async (req, res) => {
    try {

        const { role, experience, difficulty } = req.body;

        if (!role || !experience || !difficulty) {
            return res.status(400).json({
                message: "Role, experience and difficulty are required"
            });
        }

        const question = await generateInterviewQuestion(
            role,
            experience,
            difficulty
        );

        res.status(200).json({
            question
        });

    } catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({
            message: "Failed to generate interview question"
        });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                message: "Question and answer are required"
            });
        }

        const evaluation = await evaluateAnswer(
            question,
            answer
        );

        res.status(200).json({
            evaluation
        });

    } catch (error) {
        console.error("Evaluation Error:", error);

        res.status(500).json({
            message: "Failed to evaluate answer"
        });
    }
};

module.exports = {
    generateQuestion,
    submitAnswer
};

