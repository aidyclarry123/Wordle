import React, { useState } from "react";

const WORDS = [
  "apple", "grape", "peach", "mango", "berry", "lemon", "melon", "plums", "guava"
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

const MAX_ATTEMPTS = 6;

const QueryForm = () => {
  const [answer, setAnswer] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [round, setRound] = useState(1);

  const nextWord = () => {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuess("");
    setFeedback([]);
    setAttempts([]);
    setMessage("");
    setRound(r => r + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.length !== 5 || !/^[a-zA-Z]+$/.test(guess)) {
      setMessage("Please enter a valid 5-letter word.");
      return;
    }
    const fb = getFeedback(guess.toLowerCase(), answer);
    const newAttempts = [...attempts, guess];
    setAttempts(newAttempts);
    setFeedback([...feedback, fb]);
    setMessage("");
    if (guess.toLowerCase() === answer) {
      const earned = MAX_ATTEMPTS - newAttempts.length + 1;
      setPoints(points + earned);
      setMessage(`Congratulations! You guessed the word '${answer}' in ${newAttempts.length} attempts. (+${earned} points)`);
    } else if (newAttempts.length === MAX_ATTEMPTS) {
      setMessage(`Sorry, the word was '${answer}'. No points this round.`);
    }
    setGuess("");
  };

  const isRoundOver = message.includes("Congratulations") || message.includes("Sorry");

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Wordle (React Version)</h2>
      <div style={{ marginBottom: 10 }}>Round: {round} | Points: {points}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          maxLength={5}
          onChange={e => setGuess(e.target.value)}
          disabled={isRoundOver}
          style={{ textTransform: "lowercase", fontSize: 20, letterSpacing: 5 }}
        />
        <button type="submit" disabled={isRoundOver}>Guess</button>
      </form>
      <div style={{ marginTop: 20 }}>
        {feedback.map((fb, idx) => (
          <div key={idx} style={{ fontFamily: "monospace", fontSize: 22 }}>{fb}</div>
        ))}
      </div>
      {message && <div style={{ marginTop: 20, fontWeight: "bold" }}>{message}</div>}
      {isRoundOver && (
        <button style={{ marginTop: 20 }} onClick={nextWord}>Next Word</button>
      )}
    </div>
  );
};

export default QueryForm;
