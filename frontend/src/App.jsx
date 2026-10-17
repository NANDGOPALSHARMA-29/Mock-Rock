import { useState, useRef } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/interview";

function App() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef(null);

  
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please try Chrome."
      );
      return;
    }
    setError("");
    setInterimTranscript("");

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText) {
        setAnswer((previous) => {
          const separator = previous.trim() ? " " : "";
          return previous + separator + finalText.trim();
        });
      }

      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("Microphone permission denied. Allow microphone access in your browser.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try speaking again.");
      } else if (event.error !== "aborted") {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      recognitionRef.current = null;
      setIsListening(false);
      setError("Could not start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
    setInterimTranscript("");
  };


  const generateQuestion = async () => {
    if (!role || !experience || !difficulty) {
      setError("Please select role, experience and difficulty.");
      return;
    }

    setLoadingQuestion(true);
    setError("");
    setQuestion("");
    setAnswer("");
    setEvaluation("");

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, experience, difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate question.");
      }

      setQuestion(data.question);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write your answer before submitting.");
      return;
    }

    setLoadingEvaluation(true);
    setError("");
    setEvaluation("");

    try {
      const response = await fetch(`${API_URL}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to evaluate answer.");
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">M</span>
          <span>Mock <span className="brand-accent">&</span> Rock</span>
        </a>

        <div className="nav-right">
          <span className="ai-badge">
            <span className="status-dot" />
            AI INTERVIEW STUDIO
          </span>
        </div>
      </header>

      <main className="main-content" id="home">
        <section className="hero">
          <div className="eyebrow">
            <span>✦</span> YOUR NEXT OPPORTUNITY STARTS HERE
          </div>

          <h1>
            Practice smarter.
            <br />
            <span>Interview better.</span>
          </h1>

          <p className="hero-description">
            Build confidence, sharpen your answers, and get AI-powered
            feedback before your real interview.
          </p>
        </section>

        <section className="setup-card">
          <div className="section-heading">
            <div className="heading-icon">✳</div>
            <div>
              <h2>Set up your interview</h2>
              <p>Customize your session to match your goals.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="role">JOB ROLE</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select your role</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Python Developer">Python Developer</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="experience">EXPERIENCE LEVEL</label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 Years">0 – 1 Years</option>
                <option value="1-3 Years">1 – 3 Years</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="difficulty">DIFFICULTY</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            className="primary-button generate-button"
            onClick={generateQuestion}
            disabled={loadingQuestion || loadingEvaluation}
          >
            {loadingQuestion ? (
              <>Generating question...</>
            ) : (
              <>Generate interview question <span>↗</span></>
            )}
          </button>

          <p className="setup-note">
            ✦ &nbsp; Questions tailored to your selected experience and role
          </p>
        </section>

        {error && (
          <div className="error-message" role="alert">
            <span>!</span> {error}
          </div>
        )}

        {question && (
          <section className="interview-section">
            <div className="section-label">
              <span className="live-dot" />
              YOUR INTERVIEW SESSION
            </div>

            <div className="question-card">
              <div className="question-topline">
                <span className="question-number">QUESTION 01</span>
                <span className={`difficulty-tag ${difficulty.toLowerCase()}`}>
                  {difficulty}
                </span>
              </div>

              <h2>{question}</h2>

              <div className="question-meta">
                <span>◈ {role}</span>
                <span>◷ {experience}</span>
              </div>
            </div>

            <div className="answer-card">
              <div className="answer-heading">
                <div>
                  <h2>Your answer</h2>
                  <p>Explain your thought process clearly.</p>
                </div>
                <span className="editor-label">✎ TEXT EDITOR</span>
              </div>
              
<div className="voice-controls">
  <button
    type="button"
    className={`voice-button ${isListening ? "recording" : ""}`}
    onClick={isListening ? stopRecording : startRecording}
    disabled={loadingEvaluation}
  >
    <span>{isListening ? "■" : "🎙"}</span>
    {isListening ? "Stop Recording" : "Start Speaking"}
  </button>

  {isListening && (
    <span className="recording-status">
      <span className="recording-dot" />
      Listening...
    </span>
  )}
</div>

{interimTranscript && (
  <p className="interim-transcript">
    Hearing: {interimTranscript}
  </p>
)}

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Start writing your answer here..."
                rows={7}
                disabled={loadingEvaluation}
              />

              <div className="answer-footer">
                <span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span>

                <button
                  className="primary-button"
                  onClick={submitAnswer}
                  disabled={loadingEvaluation || !answer.trim()}
                >
                  {loadingEvaluation
                    ? "Evaluating..."
                    : <>Evaluate my answer <span>→</span></>}
                </button>
              </div>
            </div>
          </section>
        )}

        {evaluation && (
          <section className="evaluation-card">
            <div className="evaluation-heading">
              <div className="heading-icon">✦</div>
              <div>
                <h2>AI evaluation</h2>
                <p>Your feedback for this answer</p>
              </div>
              <span className="evaluated-badge">✓ Evaluated</span>
            </div>

            <div className="evaluation-feedback">
              {evaluation}
            </div>

            <button
              className="secondary-button"
              onClick={generateQuestion}
              disabled={loadingQuestion}
            >
              {loadingQuestion ? "Generating..." : "↻ Practice another question"}
            </button>
          </section>
        )}

        <footer className="footer">
          <div className="footer-brand">
            <span className="brand-icon small">M</span>
            <span>Mock & Rock</span>
          </div>
          <span>Built to help you show up with confidence.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
