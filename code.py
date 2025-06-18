import random

# List of possible 5-letter words (for demo purposes, a small sample)
WORDS = [
    "apple", "grape", "peach", "mango", "berry", "lemon", "melon", "plums", "guava"
]


def get_feedback(guess, answer):
    feedback = ["_"] * 5
    answer_chars = list(answer)
    # First pass: correct position
    for i in range(5):
        if guess[i] == answer[i]:
            feedback[i] = guess[i].upper()
            answer_chars[i] = None  # Mark as used
    # Second pass: correct letter, wrong position
    for i in range(5):
        if feedback[i] == "_" and guess[i] in answer_chars:
            feedback[i] = guess[i].lower()
            answer_chars[answer_chars.index(guess[i])] = None
    return " ".join(feedback)


def main():
    answer = random.choice(WORDS)
    attempts = 6
    print("Welcome to Wordle! Guess the 5-letter word.")
    for attempt in range(1, attempts + 1):
        while True:
            guess = input(f"Attempt {attempt}/{attempts}: ").lower()
            if len(guess) == 5 and guess.isalpha():
                break
            print("Invalid input. Please enter a 5-letter word.")
        feedback = get_feedback(guess, answer)
        print("Feedback:", feedback)
        if guess == answer:
            print(f"Congratulations! You guessed the word '{answer}' in {attempt} attempts.")
            return
    print(f"Sorry, the word was '{answer}'. Better luck next time!")


if __name__ == "__main__":
    main()
