import { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");

  const generateQuestion = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            experience,
            difficulty,
          }),
        }
      );

      const data = await response.json();

      setQuestion(data.question);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Mock & Rock</h1>

      <h2>Create Interview</h2>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="Java Developer">Java Developer</option>
        <option value="Frontend Developer">Frontend Developer</option>
        <option value="Backend Developer">Backend Developer</option>
        <option value="Python Developer">Python Developer</option>
      </select>

      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      >
        <option value="">Select Experience</option>
        <option value="Fresher">Fresher</option>
        <option value="0-1 Years">0-1 Years</option>
        <option value="1-3 Years">1-3 Years</option>
      </select>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button onClick={generateQuestion}>
        Generate Question
      </button>

      {question && (
        <div>
          <h2>Interview Question</h2>
          <p>{question}</p>
        </div>
      )}
    </div>
  );
}

export default App;

