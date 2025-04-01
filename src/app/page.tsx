"use client";
import { useEffect, useState } from "react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Home() {
  const [randomWord, setRandomWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== WORD_LENGTH) {
          return;
        }

        const newGuesses = [...guesses];
        const currentGuessIndex = guesses.findIndex(guess => guess === null);
        newGuesses[currentGuessIndex] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = randomWord === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
          setIsWin(true);
          return;
        }

        // Check if game is lost (last guess was wrong)
        if (currentGuessIndex === MAX_GUESSES - 1) {
          setIsGameOver(true);
          setIsWin(false);
          return;
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      // Only accept letters
      if (!/^[a-zA-Z]$/.test(event.key)) {
        return;
      }

      if (currentGuess.length >= WORD_LENGTH) {
        return;
      }

      setCurrentGuess(currentGuess + event.key.toLowerCase());
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, isGameOver, randomWord, guesses]);

  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const response = await fetch("/api/wordle-words");
        const apiData = await response.json();
        const randomWord = apiData[Math.floor(Math.random() * apiData.length)];
        setRandomWord(randomWord.toLowerCase());
      } catch (error) {
        console.error("Error fetching word list:", error);
      }
    };

    fetchWordList();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Wordle Clone</h1>
        <div className="flex flex-col gap-2 mb-8">
          {guesses.map((guess, index) => {
            const isCurrentGuess = index === guesses.findIndex(guess => guess === null);
            return (
              <Line 
                key={index} 
                guess={isCurrentGuess ? currentGuess : guess ?? ""} 
                isFinal={!isCurrentGuess && guess !== null}
                randomWord={randomWord}
              />
            );
          })}
        </div>
        {isGameOver && (
          <div className="mt-8 text-xl font-bold text-center p-4 rounded-lg bg-gray-800">
            {isWin ? (
              <div className="text-green-400">🎉 Congratulations! You won!</div>
            ) : (
              <div>
                <div className="text-red-400 mb-2">Game Over!</div>
                <div className="text-gray-300">The word was: <span className="text-yellow-400">{randomWord}</span></div>
              </div>
            )}
          </div>
        )}
        <div className="mt-8 text-center text-gray-400 text-sm">
          Type a 5-letter word and press Enter to guess
        </div>
      </div>
    </div>
  );
}

function Line({ guess, isFinal, randomWord }: { guess: string, isFinal: boolean, randomWord: string }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "w-14 h-14 border-2 rounded-md flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-200";

    if (isFinal) {
      if (char === randomWord[i]) {
        className += " bg-green-600 border-green-600 text-white";
      } else if (randomWord.includes(char)) {
        // Count occurrences of the letter in the guess and target word
        const guessCount = guess.slice(0, i + 1).split(char).length - 1;
        const targetCount = randomWord.split(char).length - 1;
        
        if (guessCount <= targetCount) {
          className += " bg-yellow-600 border-yellow-600 text-white";
        }
      } else {
        className += " bg-gray-700 border-gray-700 text-white";
      }
    } else {
      className += " border-gray-600 text-white";
    }

    tiles.push(
      <div
        key={i}
        className={className}
      >
        {char}
      </div>
    );
  }

  return <div className="flex gap-2 justify-center">{tiles}</div>;
}
