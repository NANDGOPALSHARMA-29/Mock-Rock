const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewQuestion = async (role, experience, difficulty) => {

    const prompt = `
Generate exactly ONE interview question.
Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Return only the interview question.
Do not provide the answer.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
    });

    return response.text;
};

const evaluateAnswer = async (question, answer) => {
    const prompt = `
You are an interview evaluator.
Evaluate the candidate's answer to the interview question.
Question:
${question}
Candidate Answer:
${answer}
Give a score out of 10 and brief feedback.

Return the response in this format:

Score: <score>/10
Feedback: <brief feedback>
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
    });

    return response.text;
};


module.exports = {
    generateInterviewQuestion,
    evaluateAnswer,
};

