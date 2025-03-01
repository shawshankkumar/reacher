import { PrismaClient } from "@prisma/client";
import { CityOption, Clue, RandomClueResponse, VerifyGuessRequest, VerifyGuessResponse } from "./city.model";
import { config } from "../config";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Gets a random clue from a random city and provides multiple city options
 * @param sessionId The session ID to validate
 * @returns Random clue data with options
 */
export async function getRandomClue(
  sessionId: string
): Promise<RandomClueResponse> {
  try {
    // Validate session exists and is active
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw { statusCode: 404, message: "Session not found" };
    }

    if (!session.is_active) {
      throw { statusCode: 403, message: "Session is inactive" };
    }

    // Get a random city
    const citiesCount = await prisma.city.count();
    const skip = Math.floor(Math.random() * citiesCount);

    const randomCity = await prisma.city.findFirst({
      skip: skip,
    });

    if (!randomCity) {
      // add retry here
      throw { statusCode: 500, message: "No cities found in database" };
    }

    // Parse the clues from JSON
    const clues = randomCity.clues as unknown as Clue[];

    // Get a random clue from the city
    const randomClueIndex = Math.floor(Math.random() * clues.length);
    const randomClue = clues[randomClueIndex];

    // Get all other cities first
    // Add this to a cache of all cities to avoid unnecessary database queries
    const allOtherCities = await prisma.city.findMany({});

    // Make sure we have enough cities
    if (allOtherCities.length < 3) {
      throw {
        statusCode: 500,
        message: "Not enough cities in database for options",
      };
    }

    // Shuffle the cities and take the first 3
    shuffleArray(allOtherCities);
    const otherCities = allOtherCities.slice(0, 3);

    // Create options array with correct city and 3 random cities
    const correctOption: CityOption = {
      city: randomCity.city,
      country: randomCity.country,
    };

    const otherOptions: CityOption[] = otherCities.map((city) => ({
      city: city.city,
      country: city.country,
    }));

    // Combine and shuffle options
    const allOptions = [...otherOptions, correctOption];
    shuffleArray(allOptions);

    return {
      clue: randomClue.value,
      city_id: randomCity.id,
      options: allOptions,
    };
  } catch (error) {
    console.error("Error getting random clue:", error);
    throw error;
  }
}

/**
 * Shuffles array in place using Fisher-Yates algorithm
 * @param array Array to shuffle
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Verify a user's guess for a city and update their points accordingly.
 * @param sessionId The session ID to validate
 * @param data The guess verification request data
 * @returns The verification result with updated points
 */
export async function verifyGuess(
  sessionId: string,
  data: VerifyGuessRequest
): Promise<VerifyGuessResponse> {
  try {
    // Validate session exists and is active
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw { statusCode: 404, message: "Session not found" };
    }

    if (!session.is_active) {
      throw { statusCode: 403, message: "Session is inactive" };
    }

    // Get the city by ID
    const city = await prisma.city.findUnique({
      where: { id: data.city_id },
    });

    if (!city) {
      throw { statusCode: 404, message: "City not found" };
    }

    // Check if the guess is correct (case-insensitive comparison)
    const isCorrect = city.city.toLowerCase() === data.guess_city.toLowerCase();

    // Get a random fun fact and trivia
    const funFacts = city.fun_fact as string[];
    const triviaItems = city.trivia as string[];
    
    const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    const randomTrivia = triviaItems[Math.floor(Math.random() * triviaItems.length)];

    // Update points based on correctness
    let updatedPoints: number;
    let pointsGained: number | undefined;
    let pointsLost: number | undefined;

    if (isCorrect) {
      // Award points for correct guess
      pointsGained = config.game.pointsForCorrectGuess;
      updatedPoints = session.points + pointsGained;
    } else {
      // Deduct points for incorrect guess
      pointsLost = config.game.pointsForIncorrectGuess;
      updatedPoints = Math.max(0, session.points - pointsLost); // Ensure points don't go below 0
    }

    // Update session points
    await prisma.session.update({
      where: { id: sessionId },
      data: { points: updatedPoints },
    });

    // Prepare response
    return {
      correct: isCorrect,
      ...(isCorrect ? { points_gained: pointsGained } : { points_lost: pointsLost }),
      total_points: updatedPoints,
      city: {
        city: city.city,
        country: city.country,
      },
      fun_fact: randomFunFact,
      trivia: randomTrivia,
    };
  } catch (error) {
    console.error("Error verifying guess:", error);
    throw error;
  }
}
