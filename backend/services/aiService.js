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

module.exports = {
    generateInterviewQuestion,
};

