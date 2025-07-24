import React, { useState } from "react";

const WORD_CATEGORIES = {
  Fruits: [
    "apple", "grape", "peach", "mango", "berry", "lemon", "melon", "plums", "guava", "olive", "dates", "figs", "papaw"
  ],
  Vegetables: [
    "onion", "chard", "leeks", "beans", "beets", "carrot", "radish", "turnip", "celery", "tomat", "chive"
  ].filter(word => word.length === 5),
  Animals: [
    "tiger", "zebra", "horse", "sheep", "eagle", "shark", "whale", "panda", "koala", "otter", "lemur", "bison", "camel", "gecko", "finch"
  ],
  Countries: [
    "spain", "india", "china", "egypt", "ghana", "japan", "kenya", "nepal", "qatar", "sudan", "yemen", "chile"
  ],
  Colors: [
    "white", "black", "green", "brown", "peach", "olive", "navy", "coral", "amber", "ivory"
  ],
  Sports: [
    "tennis", "rugby", "hockey", "fence", "skate", "vault", "relay"
  ].filter(word => word.length === 5),
  Cities: [
    "paris", "tokyo", "delhi", "miami", "milan", "leeds", "osaka", "sofia", "perth", "quito", "lille", "porto", "dakar"
  ],
  Flowers: [
    "lilac", "tulip", "daisy", "poppy", "lotus", "aster", "roses", "petal", "canna", "pansy"
  ],
  Tech: [
    "mouse", "cable", "modem", "drive", "pixel", "laser", "chips", "bytes", "cloud", "array", "input", "logic", "token", "stack", "patch"
  ]
};

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
  const categoryList = Object.keys(WORD_CATEGORIES);
  const [category, setCategory] = useState("Fruits");
  const [answer, setAnswer] = useState(() => {
    const words = WORD_CATEGORIES["Fruits"];
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState({ Fruits: 0 });
  const [round, setRound] = useState({ Fruits: 1 });
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [guessedLetterCounts, setGuessedLetterCounts] = useState({});

  // Helper to get current category's points/round
  const getPoints = () => points[category] || 0;
  const getRound = () => round[category] || 1;

  const nextWord = () => {
    const words = WORD_CATEGORIES[category];
    setAnswer(words[Math.floor(Math.random() * words.length)]);
    setGuess("");
    setFeedback([]);
    setAttempts([]);
    setMessage("");
    setRound(r => ({ ...r, [category]: getRound() + 1 }));
    setGuessedLetters([]);
    setGuessedLetterCounts({});
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    const words = WORD_CATEGORIES[newCategory];
    setAnswer(words[Math.floor(Math.random() * words.length)]);
    setGuess("");
    setFeedback([]);
    setAttempts([]);
    setMessage("");
    // If switching to a new category, initialize its points/round if not present
    setPoints(p => ({ ...p, [newCategory]: p[newCategory] || 0 }));
    setRound(r => ({ ...r, [newCategory]: r[newCategory] || 1 }));
    setGuessedLetters([]);
    setGuessedLetterCounts({});
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
    // Track guessed letters and their counts
    setGuessedLetters(prev => {
      const newLetters = guess.toLowerCase().split("");
      return Array.from(new Set([...prev, ...newLetters]));
    });
    setGuessedLetterCounts(prev => {
      const newCounts = { ...prev };
      guess.toLowerCase().split("").forEach(l => {
        newCounts[l] = (newCounts[l] || 0) + 1;
      });
      return newCounts;
    });
    if (guess.toLowerCase() === answer) {
      const earned = MAX_ATTEMPTS - newAttempts.length + 1;
      setPoints(p => ({ ...p, [category]: getPoints() + earned }));
      setMessage(`Congratulations! You guessed the word '${answer}' in ${newAttempts.length} attempts. (+${earned} points)`);
    } else if (newAttempts.length === MAX_ATTEMPTS) {
      setMessage(`Sorry, the word was '${answer}'. No points this round.`);
    }
    setGuess("");
  };

  const isRoundOver = message.includes("Congratulations") || message.includes("Sorry");

  // Letters guessed, with strikethrough for those not in answer
  // and color if more instances are needed
  const answerLettersArr = answer.split("");
  const answerLetterCounts = answerLettersArr.reduce((acc, l) => {
    acc[l] = (acc[l] || 0) + 1;
    return acc;
  }, {});
  const guessedDisplay = guessedLetters.length > 0 && (
    <div style={{ marginTop: 10 }}>
      <strong>Guessed Letters: </strong>
      {guessedLetters.map((letter, idx) => {
        const inAnswer = answerLetterCounts[letter];
        const guessedCount = guessedLetterCounts[letter] || 0;
        if (!inAnswer) {
          return (
            <span key={idx} style={{ textDecoration: "line-through", color: "#888", fontSize: 20, marginRight: 4 }}>{letter}</span>
          );
        }
        // Highlight if not enough guessed
        const highlight = guessedCount < inAnswer;
        return (
          <span key={idx} style={{ fontSize: 20, marginRight: 8, color: highlight ? "#d4a100" : "#222", fontWeight: highlight ? "bold" : "normal", borderBottom: highlight ? "2px solid #d4a100" : "none" }}>
            {letter} <span style={{ fontSize: 14, color: "#888" }}>({guessedCount}/{inAnswer})</span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Wordle (React Version)</h2>
      <div style={{ marginBottom: 10 }}>Round: {getRound()} | Points: {getPoints()}</div>
      <div style={{ marginBottom: 10 }}>
        <label>Category: </label>
        <select value={category} onChange={handleCategoryChange}>
          {categoryList.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
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
      {guessedDisplay}
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
