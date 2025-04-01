import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.frontendexpert.io/api/fe/wordle-words');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching word list:', error);
    return NextResponse.json({ error: 'Failed to fetch word list' }, { status: 500 });
  }
} 