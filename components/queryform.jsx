import React, { useState } from "react";

const WORDS = [
  "apple", "grape", "peach", "mango", "berry", "lemon", "melon", "cherry", "plums", "guava"
];

function getFeedback(guess, answer) {
  let feedback = Array(5).fill("_");
  let answerChars = answer.split("");
  // First pass: correct position
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = guess[i].toUpperCase();
      answerChars[i] = null;
    }
  }
  // Second pass: correct letter, wrong position
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === "_" && answerChars.includes(guess[i])) {
      feedback[i] = guess[i].toLowerCase();
      answerChars[answerChars.indexOf(guess[i])] = null;
    }
  }
  return feedback.join(" ");
}

const QueryForm = () => {
  const [answer] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.length !== 5 || !/^[a-zA-Z]+$/.test(guess)) {
      setMessage("Please enter a valid 5-letter word.");
      return;
    }
    const fb = getFeedback(guess.toLowerCase(), answer);
    setAttempts([...attempts, guess]);
    setFeedback([...feedback, fb]);
    setMessage("");
    if (guess.toLowerCase() === answer) {
      setMessage(`Congratulations! You guessed the word '${answer}'.`);
    } else if (attempts.length + 1 === 6) {
      setMessage(`Sorry, the word was '${answer}'.`);
    }
    setGuess("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Wordle (React Version)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          maxLength={5}
          onChange={e => setGuess(e.target.value)}
          disabled={message.includes("Congratulations") || message.includes("Sorry")}
          style={{ textTransform: "lowercase", fontSize: 20, letterSpacing: 5 }}
        />
        <button type="submit" disabled={message.includes("Congratulations") || message.includes("Sorry")}>Guess</button>
      </form>
      <div style={{ marginTop: 20 }}>
        {feedback.map((fb, idx) => (
          <div key={idx} style={{ fontFamily: "monospace", fontSize: 22 }}>{fb}</div>
        ))}
      </div>
      {message && <div style={{ marginTop: 20, fontWeight: "bold" }}>{message}</div>}
    </div>
  );
};

export default QueryForm;
