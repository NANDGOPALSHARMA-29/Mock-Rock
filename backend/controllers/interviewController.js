const {generateInterviewQuestion} = require("../services/aiService");

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

module.exports = {
    generateQuestion
};

