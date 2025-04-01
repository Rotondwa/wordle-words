# Wordle Clone

A modern implementation of the popular word-guessing game Wordle, built with Next.js and TypeScript.

## Features

- 5-letter word guessing game
- 6 attempts to guess the correct word
- Real-time keyboard input
- Modern, responsive UI with Tailwind CSS
- Server-side word selection to prevent cheating

## How to Play

1. Start the game by typing your first 5-letter word guess
2. Press Enter to submit your guess
3. Use Backspace to delete letters
4. You have 6 attempts to guess the correct word
5. The game ends when you either:
   - Guess the correct word
   - Run out of attempts

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing!

## Technical Details

- Built with Next.js 14 and TypeScript
- Uses the App Router for modern Next.js features
- Styled with Tailwind CSS
- Word list fetched from Frontend Expert API
- Server-side API route to handle CORS and word selection

## Development

The project structure is organized as follows:

- `src/app/page.tsx` - Main game component
- `src/app/api/wordle-words/route.ts` - API route for word selection
- `src/app/globals.css` - Global styles and Tailwind configuration

## License

MIT
