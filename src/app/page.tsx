"use client";
import { useEffect, useState } from "react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Home() {

  const [randomWord, setRandomWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    
    const handleTye = (event: KeyboardEvent) => {
      
      if(isGameOver){
        return;
      }

      if(event.key === "Enter"){
        if(currentGuess.length !== WORD_LENGTH){
          return;
        }

        const isCorrect = randomWord === currentGuess;
        if(isCorrect){
          setIsGameOver(true);
          return;
        }
      }

      if(event.key === "Backspace"){
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= WORD_LENGTH) {
        return;
      }

      setCurrentGuess(currentGuess + event.key);
    }
    
    window.addEventListener("keydown", handleTye);
    return () => window.removeEventListener("keydown", handleTye);
  },[currentGuess, isGameOver, randomWord])


  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const response = await fetch("/api/wordle-words");
        const apiData = await response.json();
        const randomWord = apiData[Math.floor(Math.random() * apiData.length)];

        console.log(randomWord);
        setRandomWord(randomWord);
      } catch (error) {
        console.error("Error fetching word list:", error);
      }
    };

    fetchWordList();
  }, []);

  return (
    <div>
      {guesses.map((guess, index) => {
        const isCurrentGuess = index === guesses.findIndex(guess => guess === null);
        return <Line key={index} guess={isCurrentGuess ? currentGuess : guess ?? ""} />;
      })}
    </div>
  );
}

function Line({ guess }: { guess: string }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    tiles.push(
      <div
        key={i}
        className="w-14 h-14 border border-gray-300 rounded-md flex items-center justify-center text-2xl font-bold uppercase"
      >
        {char}
      </div>
    );
  }

  return <div className="flex gap-2">{tiles}</div>;
}
