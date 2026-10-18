
import { useEffect, useState } from "react";
import "./HistoryPage.css";

const HISTORY_URL = "http://localhost:5000/api/history";

function HistoryPage({ onBack }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const response = await fetch(HISTORY_URL, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load interview history."
          );
        }

        if (active) {
          setInterviews(data.interviews || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load history.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <main className="history-page">
      <div className="history-header">
        <div>
          <span className="history-eyebrow">YOUR PROGRESS</span>
          <h1>Interview History</h1>
          <p>Review your previous practice sessions.</p>
        </div>

        <button className="history-back" onClick={onBack}>
          ← Back to interview
        </button>
      </div>

      {loading && <p>Loading your interviews...</p>}

      {error && (
        <p className="history-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && interviews.length === 0 && (
        <section className="history-empty">
          <h2>No interviews yet</h2>
          <p>
            Complete your first 3-question interview to see
            your results here.
          </p>
          <button className="history-primary" onClick={onBack}>
            Start an interview
          </button>
        </section>
      )}

      {!loading && !error && interviews.length > 0 && (
        <div className="history-list">
          {interviews.map((interview) => (
            <article className="history-card" key={interview._id}>
              <div className="history-card-top">
                <div>
                  <h2>{interview.role}</h2>
                  <p>{formatDate(interview.createdAt)}</p>
                </div>

                <div className="history-score">
                  <strong>{interview.percentage}%</strong>
                  <span>Overall score</span>
                </div>
              </div>

              <div className="history-tags">
                <span>{interview.experience}</span>
                <span>{interview.difficulty}</span>
                <span>{interview.results.length} questions</span>
              </div>

              <p className="history-average">
                Average score: {interview.averageScore}/10
              </p>

              <button
                className="history-secondary"
                onClick={() =>
                  setSelectedInterview(
                    selectedInterview?._id === interview._id
                      ? null
                      : interview
                  )
                }
              >
                {selectedInterview?._id === interview._id
                  ? "Hide scorecard ↑"
                  : "View scorecard →"}
              </button>

              {selectedInterview?._id === interview._id && (
                <div className="history-details">
                  {interview.results.map((result) => (
                    <section
                      className="history-result"
                      key={result.questionNumber}
                    >
                      <h3>
                        Question {result.questionNumber}
                        {" — "}
                        {result.score === null ||
                        result.score === undefined
                          ? "Score unavailable"
                          : `${result.score}/10`}
                      </h3>

                      <p>
                        <strong>Question:</strong>{" "}
                        {result.question}
                      </p>
                      <p>
                        <strong>Your answer:</strong>{" "}
                        {result.answer || "No answer recorded"}
                      </p>
                      <p>
                        <strong>AI feedback:</strong>{" "}
                        {result.evaluation || "No feedback recorded"}
                      </p>
                    </section>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default HistoryPage;
