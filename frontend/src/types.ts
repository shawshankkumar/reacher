export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  funFact: string;
}

export interface City {
  id: number;
  name: string;
  questions: Question[];
}

export interface GameState {
  sessionId: string | null;
  points: number;
  currentQuestion: CityQuestion | null;
  isGameOver: boolean;
  username: string;
}

export interface ShareData {
  username: string;
  score: number;
  sessionId: string;
}

export interface CityQuestion {
  clue: string;
  city_id: string;
  options: CityOption[];
}

export interface CityOption {
  city: string;
  country: string;
}

export interface GuessResult {
  correct: boolean;
  points_gained?: number;
  points_lost?: number;
  total_points: number;
  city: CityOption;
  fun_fact: string;
  trivia: string;
}

export interface InviteData {
  username: string;
  points: number;
  image_link: string;
}