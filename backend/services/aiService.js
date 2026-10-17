const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


const generateInterviewQuestion = async (
  role,
  experience,
  difficulty,
  previousResults = []
) => {
  const history = previousResults.map((result, index) => ({
    questionNumber: index + 1,
    question: result.question,
    answer: result.answer,
    score: result.score,
    feedback: result.evaluation,
  }));

  const prompt = `
You are an adaptive technical interviewer for Mock & Rock.

Candidate profile:
Role: ${role}
Experience: ${experience}
Initial difficulty: ${difficulty}

Previous interview performance:
${JSON.stringify(history, null, 2)}

Generate exactly ONE new interview question.

ADAPTIVE RULES:

1. If there are no previous results, use the initial difficulty.

2. Based on the most recent score:
   - Score 0-4: Ask an easier question focused on fundamentals.
   - Score 5-6: Ask a question at a similar level, targeting weak concepts.
   - Score 7-8: Maintain or slightly increase difficulty.
   - Score 9-10: Increase difficulty where appropriate.

3. Consider previous answers and feedback to identify weak concepts.
4. Avoid repeating previous questions or asking minor rewordings.
5. Explore a different relevant concept when appropriate.
6. Keep the question relevant to the candidate's role and experience.
7. Generate only ONE question.
8. Return only the question text, without the answer or explanation.

Previous questions:
${history.map((item) => item.question).join("\n")}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const question = response.text?.trim();

  if (!question) {
    throw new Error("AI returned an empty question.");
  }

  return question;
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
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    return response.text;
};


module.exports = {
    generateInterviewQuestion,
    evaluateAnswer,
};

